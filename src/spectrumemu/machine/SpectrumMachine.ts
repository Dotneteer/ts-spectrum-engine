import { ISpectrumVm } from "../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "./NoopSpectrumVm";
import { IStackDebugSupport } from "../abstraction/IStackDebugSupport";
import { VmState } from "./VmState";
import { IVmComponentProvider } from "../abstraction/IVmComponentProvider";
import { VmStateChangedArgs } from "./VmStateChangedArgs";
import { SpectrumModels, ZX_SPECTRUM_128, ZX_SPECTRUM_P3_E } from "./SpectrumModels";
import { DeviceInfoCollection } from "./DeviceInfoCollection";
import { SpectrumEngine } from "./SpectrumEngine";
import { PT_DEBUGINFO, PT_ROM, PT_KEYBOARD, PT_TAPE } from "../devices/DeviceTypes";
import { ISpectrumDebugInfoProvider } from "../abstraction/ISpectrumDebugInfoProvider";
import { SpectrumEdition } from "./SpectrumEdition";
import { CpuDeviceInfo } from "../cpu/CpuDeviceInfo";
import { RomDeviceInfo } from "../devices/rom/RomDeviceInfo";
import { SpectrumRomDevice } from "../devices/rom/SpectrumRomDevice";
import { IRomProvider } from "../abstraction/IRomProvider";
import { Spectrum48MemoryDevice } from "../devices/memory/Spectrum48MemoryDevice";
import { MemoryDeviceInfo } from "../devices/memory/MemoryDeviceInfo";
import { PortDeviceInfo } from "../devices/ports/PortDeviceInfo";
import { Spectrum48PortDevice } from "../devices/ports/Spectrum48PortDevice";
import { HrClock } from "../devices/clock/HrClock";
import { IKeyboardProvider } from "../abstraction/IKeyboardProvider";
import { KeyboardDevice } from "../devices/keyboard/KeyboardDevice";
import { KeyboardDeviceInfo } from "../devices/keyboard/KeyboardDeviceInfo";
import { ScreenDeviceInfo } from "../devices/screen/ScreenDeviceInfo";
import { BeeperDeviceInfo } from "../devices/beeper/BeeperDeviceInfo";
import { ITapeProvider } from "../abstraction/ITapeProvider";
import { TapeDeviceInfo } from "../devices/tape/TapeDeviceInfo";
import { ExecuteCycleOptions } from "./ExecuteCycleOptions";
import { ExecutionCompletionReason } from "./ExecutionCompletionReason";
import { Spectrum128MemoryDevice } from "../devices/memory/Spectrum128MemoryDevice";
import { Spectrum128PortDevice } from "../devices/ports/Spectrum128PortDevice";
import { SoundDeviceInfo } from "../devices/sound/SoundDeviceInfo";
import { delay } from "../utils/AsyncUtils";
import { CancellationTokenSource } from "../utils/CancellationTokenSource";
import { LiteEvent } from "../utils/LiteEvent";

/**
 * The providers to be used when a new machine is created
 */
const _providerFactories = new Map<string, () => IVmComponentProvider>();

/**
 * This class can be used to manage the lifecycle of a Spectrum machine.
 */
export class SpectrumMachine {
    private _spectrumVm: ISpectrumVm = new NoopSpectrumVm();
    private _stackDebugSupport: IStackDebugSupport | undefined;
    private _vmState: VmState = VmState.None;
    private _cancellationTokenSource: CancellationTokenSource | undefined;
    private _isFirstStart: boolean = false;
    private _isFirstPause: boolean = false;
    private _executionCycleError: Error | undefined;
    private _executionCycleResult: boolean = false;
    private _cancelled: boolean = false;
    private _justRestoredState: boolean = false;

    private _vmStateChanged = new LiteEvent<VmStateChangedArgs>();
    private _vmScreenRefreshed = new LiteEvent<void>();
    private _vmStoppedWithError = new LiteEvent<void>();
    private _vmBeeperSamplesEmitted = new LiteEvent<number[]>();
    private _vmSoundSamplesEmitted = new LiteEvent<number[]>();

    private _hrClock = new HrClock();
    private _lastFrameProcessingTime: number;
    private _completionTask: Promise<void> | undefined;

    /**
     * Resets the collection of provider factories
     */
    static resetProviders() {
        _providerFactories.clear();
    }

    /**
     * Registers a provider factory function
     * @param key Provider key
     * @param value Provider factory function
     */
    static registerProvider(key: string, value: () => IVmComponentProvider) {
        _providerFactories.set(key, value);
    }

    /**
     * The ZX Spectrum virtual machine object
     */
    get spectrumVm(): ISpectrumVm {
        return this._spectrumVm;    
    }

    /**
     * Object that provides stack debug support
     */
    get stackDebugSupport(): IStackDebugSupport | undefined {
        return this._stackDebugSupport;
    }

    /**
     * The current state of the virtual machine
     */
    get vmState(): VmState {
        return this._vmState;
    }
    set vmState(newState: VmState) {
        const oldState = this._vmState;
        this._vmState = newState;
        this._vmStateChanged.trigger(new VmStateChangedArgs(oldState, newState));
    }

    /**
     * The cancellation token source to suspend or stop the virtual machine
     */
    get cancellationTokenSource(): CancellationTokenSource | undefined {
        return this._cancellationTokenSource;
    }

    /**
     * Signs that this is the very first start of the
     * virtual machine 
     */
    get isFirstStart(): boolean {
        return this._isFirstStart;
    }

    /**
     * Signs that this is the very first paused state
     * of the virtual machine
     */
    get isFirstPause(): boolean {
        return this._isFirstPause;
    }

    /**
     * Exception that has been raised during the execution
     */
    get executionCycleError(): Error | undefined {
        return this._executionCycleError;
    }

    /**
     * Result of the execution.
     * True, if the cycle has been completed; false if it has been cancelled.
     */
    get executionCycleResult(): boolean {
        return this._executionCycleResult;
    }

    /**
     * Has the execution been cancelled?
     */
    get cancelled(): boolean {
        return this._cancelled;
    }

    /**
     * Indicates if machine state has just been restored.
     */
    get justRestoredState(): boolean {
        return this._justRestoredState;
    }

    /**
     * This event is raised whenever the state of the virtual machine changes
     */
    get vmStateChanged(): LiteEvent<VmStateChangedArgs> {
        return this._vmStateChanged;
    }

    /**
     * This event is raised when the screen of the virtual machine has
     * been refreshed
     */
    get vmScreenRefreshed(): LiteEvent<void> {
        return this._vmScreenRefreshed;
    }

    /**
     * This event is raised when a new beeper sample frame is emitted
     */
    get vmBeeperSamplesEmitted(): LiteEvent<number[]> {
        return this._vmBeeperSamplesEmitted;
    }

    /**
     * This event is raised when a new sound sample frame is emitted
     */
    get vmSoundSamplesEmitted(): LiteEvent<number[]> {
        return this._vmSoundSamplesEmitted;
    }

    /**
     * This event is raised when the engine stops because of an exception
     */
    get vmStoppedWithError(): LiteEvent<void> {
        return this._vmStoppedWithError;
    }

    /**
     * Gets the high-resolution clock of this machine
     */
    get hrClock(): HrClock { 
        return this._hrClock;
    }

    /**
     * Gets the processing time of the last frame
     */
    get lastFrameProcessingTime(): number {
        return this._lastFrameProcessingTime
    }

    /**
     * Creates a SpectrumMachine instance according to the specified edition key
     * @param modelKey Spectrum model key
     * @param editionKey Edition key (within the model)
     * @returns The newly created machine instance
     */
    static createMachine(modelKey: string, editionKey: string): SpectrumMachine {
        // --- Check input
        const model = SpectrumModels.stockModels.get(modelKey);
        if (!model) {
            throw new Error(`Cannot find a Spectrum model with key '${modelKey}'`);
        }

        const edition = model.editions.get(editionKey);
        if (!edition) {
            throw new Error(`Cannot find an edition of {modelKey} with key '${editionKey}'`);
        }

        // --- Create the selected Spectrum model/edition
        let devices: DeviceInfoCollection;
        switch (modelKey) {
            case ZX_SPECTRUM_128:
                devices = SpectrumMachine._createSpectrum128Devices(edition);
                break;
            case ZX_SPECTRUM_P3_E:
                // TODO: Implement Spectrum +3 devices
                devices = SpectrumMachine._createSpectrum48Devices(edition);
                break;
            default:
                devices = SpectrumMachine._createSpectrum48Devices(edition);
                break;
        }

        // --- Setup the machine
        const machine = new SpectrumMachine();
        machine._spectrumVm = new SpectrumEngine(devices);
        machine._vmState = VmState.None;
        const debugProvider = SpectrumMachine._getProvider(PT_DEBUGINFO);
        if (debugProvider) {
            machine._spectrumVm.debugInfoProvider = debugProvider as ISpectrumDebugInfoProvider;
        }

        return machine;
    }

    /**
     * Gets a provider instance for the specified provider types
     * @param key Service provider key
     * @param optional Is the provider optional?
     * @returns Provider instance, if found; otherwise, undefined
     * Error: The requested mandatory provider cannot be found
     */
    static _getProvider(key: string, optional = true): IVmComponentProvider | undefined {
        const factory = _providerFactories.get(key);
        if (factory) {
               return factory();
        }

        if (optional) {
            return undefined;
        }
        throw new Error(`Cannot find a factory for ${key}`);
    }

    /**
     * Create the collection of devices for the Spectrum 48K virtual machine
     * @param spectrumConfig Machine configuration
     */
    static _createSpectrum48Devices(spectrumConfig: SpectrumEdition): DeviceInfoCollection {
        const dc = new DeviceInfoCollection();
        dc.add(new CpuDeviceInfo(spectrumConfig.cpu));

        dc.add(new RomDeviceInfo(SpectrumMachine._getProvider(PT_ROM, false) as IRomProvider, 
            spectrumConfig.rom, new SpectrumRomDevice()));
        dc.add(new MemoryDeviceInfo(spectrumConfig.memory, new Spectrum48MemoryDevice()));
        dc.add(new PortDeviceInfo(new Spectrum48PortDevice()));
        dc.add(new KeyboardDeviceInfo(SpectrumMachine._getProvider(PT_KEYBOARD) as IKeyboardProvider, 
            new KeyboardDevice()));
        dc.add(new ScreenDeviceInfo(spectrumConfig.screen));
        dc.add(new BeeperDeviceInfo());
        dc.add(new TapeDeviceInfo(SpectrumMachine._getProvider(PT_TAPE) as ITapeProvider));
        return dc;
    }

    /**
     * Create the collection of devices for the Spectrum 48K virtual machine
     * @param spectrumConfig Machine configuration
     */
    static _createSpectrum128Devices(spectrumConfig: SpectrumEdition): DeviceInfoCollection {
        const dc = new DeviceInfoCollection();
        dc.add(new CpuDeviceInfo(spectrumConfig.cpu));

        dc.add(new RomDeviceInfo(SpectrumMachine._getProvider(PT_ROM, false) as IRomProvider, 
            spectrumConfig.rom, new SpectrumRomDevice()));
        dc.add(new MemoryDeviceInfo(spectrumConfig.memory, new Spectrum128MemoryDevice()));
        dc.add(new PortDeviceInfo(new Spectrum128PortDevice()));
        dc.add(new KeyboardDeviceInfo(SpectrumMachine._getProvider(PT_KEYBOARD) as IKeyboardProvider, 
            new KeyboardDevice()));
        dc.add(new ScreenDeviceInfo(spectrumConfig.screen));
        dc.add(new BeeperDeviceInfo());
        dc.add(new TapeDeviceInfo(SpectrumMachine._getProvider(PT_TAPE) as ITapeProvider));
        dc.add(new SoundDeviceInfo());
        return dc;
    }

    /**
     * Gets the promise that represents completion
     */
    get completionTask(): Promise<void> | undefined {
        return this._completionTask;
    }

    /**
     * Starts the virtual machine with the specified exeution options
     * @param options Execution options
     */
    start(options: ExecuteCycleOptions): void {
        if (this.vmState === VmState.Running) {
            return;
        }

        // --- Prepare the machine to run
        this._isFirstStart = this.vmState === VmState.None || this.vmState === VmState.Stopped;
        if (this._isFirstStart) {
            this.spectrumVm.reset();
        }
        if (this.spectrumVm.debugInfoProvider) {
            this.spectrumVm.debugInfoProvider.prepareBreakpoints();
        }

        this._cancellationTokenSource = new CancellationTokenSource();

        // --- Allow setting up the keyboard mappings
        this.spectrumVm.keyboardProvider.setMappings();
        
        // --- Execute a single cycle
        this.vmState = VmState.Running;
        this._completionTask = this._executeCycle(this, options);
    }

    /**
     * Pauses the running machine.
     */
    async pause(): Promise<void> {
        if (this.vmState === VmState.None || this.vmState === VmState.Stopped
            || this.vmState === VmState.Paused) {
            // --- Nothing to pause
            return;
        }

        if (!this._completionTask || !this._cancellationTokenSource) {
            // --- No completion to wait for
            return;
        }

        // --- Prepare the machine to pause
        this.vmState = VmState.Pausing;
        this._isFirstPause = this._isFirstStart;

        // --- Cancel the current execution cycle
        this._cancellationTokenSource.cancel();
        await this._completionTask;
        this.vmState = VmState.Paused;
    }

    async stop(): Promise<void> {
        // --- Stop only running machine    
        switch (this._vmState) {
            case VmState.None:
            case VmState.Stopped:
                return;

            case VmState.Paused:
                // --- The machine is paused, it can be quicky stopped
                this.vmState = VmState.Stopping;
                this.vmState = VmState.Stopped;
                break;

            default:
                // --- Initiate stop
                this.vmState = VmState.Stopping;
                if (this._completionTask && this._cancellationTokenSource) {
                    this._cancellationTokenSource.cancel();
                    await this._completionTask;
                }
                this.vmState = VmState.Stopped;
                break;
        }
    }

    /**
     * Executes the cycle of the Spectrum virtual machine
     * @param machine The virtual machine
     * @param options Execution options
     */
    async _executeCycle(machine: SpectrumMachine, options: ExecuteCycleOptions): Promise<void> {
        // --- This is not assumed to happen, but let's check
        if (!this.cancellationTokenSource) {
            return;
        }

        // --- Store the start time of the frame
        const frequency = this._hrClock.getFrequency();
        const frameTacts = machine.spectrumVm.screenConfiguration.screenRenderingFrameTactCount;
        const clockFreq = machine.spectrumVm.baseClockFrequency * machine.spectrumVm.clockMultiplier;
        const nextFrameGap = (frameTacts / clockFreq) * frequency;
        let nextFrameTime = this._hrClock.getCounter() + nextFrameGap;
        
        // --- Execute the cycle until completed
        while (true) {
            let cycleStartTime = this._hrClock.getCounter();
            const result = machine.spectrumVm.executeCycle(this.cancellationTokenSource.token, options);
            const cycleEndTime = this._hrClock.getCounter();
            this._lastFrameProcessingTime = (cycleEndTime - cycleStartTime)/frequency * 1000;
            if (!result) {
                // --- The execution has been cancelled
                return;
            }
            const reason = machine.spectrumVm.executionCompletionReason;
            if (reason !== ExecutionCompletionReason.FrameCompleted) {
                // --- No more frame to execute
                if (reason === ExecutionCompletionReason.BreakpointReached
                    || reason === ExecutionCompletionReason.TerminationPointReached) {
                        machine.vmState = VmState.Paused;
                    }
                return;
            }

            // --- At this point we have not completed the execution yet
            // --- Initiate the refresh of the screen
            machine._vmScreenRefreshed.trigger();
            machine._vmBeeperSamplesEmitted.trigger(machine.spectrumVm.beeperDevice.audioSamples);
            if (machine.spectrumVm.soundDevice) {
                machine._vmSoundSamplesEmitted.trigger(machine.spectrumVm.soundDevice.audioSamples);
            }
            const curTime = this._hrClock.getCounter();
            const toWait = Math.floor((nextFrameTime - curTime) / (frequency/1000));
            await delay(toWait - 2);
            nextFrameTime += nextFrameGap;
        }
    }
}