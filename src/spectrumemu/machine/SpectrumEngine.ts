import { ISpectrumVm } from "../abstraction/ISpectrumVm";
import { ISpectrumVmTestSupport } from "../abstraction/ISpectrumVmTestSupport";
import { ISpectrumVmRunCodeSupport } from "../abstraction/ISpectrumVmRunCodeSupport";
import { ISpectrumBoundDevice } from "../abstraction/ISpectrumBoundDevice";
import { IFrameBoundDevice } from "../abstraction/IFrameBoundDevice";
import { ExecutionCompletionReason } from "./ExecutionCompletionReason";
import { DeviceInfoCollection } from "./DeviceInfoCollection";
import { ExecuteCycleOptions } from "./ExecuteCycleOptions";
import { IRomConfiguration } from "../abstraction/IRomConfiguration";
import { IRomProvider } from "../abstraction/IRomProvider";
import { IRomDevice } from "../abstraction/IRomDevice";
import { IMemoryConfiguration } from "../abstraction/IMemoryConfiguration";
import { IScreenDevice } from "../abstraction/IScreenDevice";
import { IInterruptDevice } from "../abstraction/IInterruptDevice";
import { ISoundDevice } from "../abstraction/ISoundDevice";
import { ITapeDevice } from "../abstraction/ITapeDevice";
import { ITapeProvider } from "../abstraction/ITapeProvider";
import { IDivIdeDevice } from "../abstraction/IDivIdeDevice";
import { IFloppyConfiguration } from "../abstraction/IFloppyConfiguration";
import { IFloppyDevice } from "../abstraction/IFloppyDevice";
import { INextFeatureSetDevice } from "../abstraction/INextFeatureSetDevice";
import { IVmComponentProvider } from "../abstraction/IVmComponentProvider";
import { IDevice } from "../abstraction/IDevice";
import { IDeviceInfo } from "../abstraction/IDeviceInfo";
import { IDeviceConfiguration } from "../abstraction/IDeviceConfiguration";
import { IScreenFrameProvider } from "../abstraction/IScreenFrameProvider";
import { IScreenConfiguration } from "../abstraction/IScreenConfiguration";
import { IKeyboardProvider } from "../abstraction/IKeyboardProvider";
import { InterruptDevice } from "../devices/interrupt/InterruptDevice";
import { KeyboardDevice } from "../devices/keyboard/KeyboardDevice";
import { BeeperDevice } from "../devices/beeper/BeeperDevice";
import { Spectrum48MemoryDevice } from "../devices/memory/Spectrum48MemoryDevice";
import { IPortDevice } from "../abstraction/IPortDevice";
import { Spectrum48PortDevice } from "../devices/ports/Spectrum48PortDevice";
import { IZ80Cpu } from "../abstraction/IZ80Cpu";
import { ICpuOperationBoundDevice } from "../abstraction/ICpuOperationBoundDevice";
import { Z80Cpu } from "../cpu/Z80Cpu";
import { MemoryContentionType } from "../devices/memory/MemoryContentionType";
import { MemoryConfigurationData } from "../devices/memory/MemoryConfigurationData";
import { SpectrumRomDevice } from "../devices/rom/SpectrumRomDevice";
import { RomConfigurationData } from "../devices/rom/RomConfigurationData";
import { NoopRomProvider } from "../devices/rom/NoopRomProvider";
import { IMemoryDevice } from "../abstraction/IMemoryDevice";
import { NoopRomDevice } from "../devices/rom/NoopRomDevice";
import { NoopMemoryDevice } from "../devices/memory/NoopMemoryDevice";
import { ScreenConfiguration } from "../devices/screen/ScreenConfiguration";
import { ScreenConfigurationData } from "../devices/screen/ScreenConfigurationData";
import { NoopScreenDevice } from "../devices/screen/NoopScreenDevice";
import { NoopKeyboardDevice } from "../devices/keyboard/NoopKeyboardDevice";
import { NoopKeyboardProvider } from "../devices/keyboard/NoopKeyboardProvider";
import { NoopBeeperDevice } from "../devices/beeper/NoopBeeperDevice";
import { NoopTapeDevice } from "../devices/tape/NoopTapeDevice";
import { NoopTapeProvider } from "../devices/tape/NoopTapeProvider";
import { ISpectrumDebugInfoProvider } from "../abstraction/ISpectrumDebugInfoProvider";
import { IKeyboardDevice } from "../abstraction/IKeyboardDevice";
import { IBeeperDevice } from "../abstraction/IBeeperDevice";
import { DT_NEXTFS, DT_MEMORY, DT_PORT, DT_ROM, DT_SCREEN, DT_BEEPER, DT_KEYBOARD, DT_TAPE, DT_SOUND, DT_DIVIDE, DT_FLOPPY, DT_CPU } from "../devices/DeviceTypes";
import { Spectrum48ScreenDevice } from "../devices/screen/Spectrum48ScreenDevice";
import { TapeDevice } from "../devices/tape/TapeDevice";
import { NoopScreenFrameProvider } from "../devices/screen/NoopScreenFrameProvider";
import { SpectrumDebugInfoProvider } from "./SpectrumDebugInfoProvider";
import { ICpuConfiguration } from "../abstraction/ICpuConfiguration";
import { EmulationMode } from "./EmulationMode";
import { Z80StateFlags } from "../cpu/Z80StateFlags";
import { DebugStepMode } from "./DebugStepMode";
import { RegisterDiagInfo } from "./RegisterDiagInfo";
import { ScreenRenderingPhase } from "../devices/screen/ScreenRenderingPhase";
import { LiteEvent } from "../utils/LiteEvent";
import { CancellationToken } from "../utils/CancellationToken";

/**
 * This class represents a ZX Spectrum 48 virtual machine
 */
export class SpectrumEngine implements ISpectrumVm, 
    ISpectrumVmTestSupport,
    ISpectrumVmRunCodeSupport {

    private _frameTacts = 0;
    private _frameCompleted = false;
    private readonly _spectrumDevices: ISpectrumBoundDevice[] = [];
    private readonly _frameBoundDevices: IFrameBoundDevice[] = [];
    private readonly _cpuBoundDevices: ICpuOperationBoundDevice[] = [];
    private _lastBreakpoint: number | undefined;
    private _frameCompletedEvent = new LiteEvent<void>();

    readonly key = "SpectrumVm";

    /**
     * The CPU tick at which the last frame rendering started;
     */
    lastFrameStartCpuTick = 0;

    /**
     * The last rendered ULA tact 
     */
    lastRenderedUlaTact = 0;

    /**
     * Gets the reason why the execution cycle of the SpectrumEngine completed.
     */
    executionCompletionReason: ExecutionCompletionReason = ExecutionCompletionReason.None;

    /**
     * Collection of Spectrum devices
     */
    readonly deviceData: DeviceInfoCollection;
        
    /**
     * The Z80 CPU of the machine
     */
    readonly cpu: IZ80Cpu;

    /**
     * Gets the ULA revision (2/3)
     */
    readonly ulaIssue: string;

    /**
     * The CPU tact at which the last execution cycle started
     */
    lastExecutionStartTact = 0;
    
    /**
     * Gets or sets the value of the contention accummulated since the start of 
     * the machine
     */
    contentionAccumulated = 0;

    /**
     * Gets the value of the contention accummulated when the 
     * execution cycle started
     */
    lastExecutionContentionValue = 0;

    /**
     * The current execution cycle options
     */
    executeCycleOptions: ExecuteCycleOptions = new ExecuteCycleOptions();

    /**
     * The configuration of the ROM
     */
    readonly romConfiguration: IRomConfiguration = new RomConfigurationData();

    /**
     * The ROM provider object
     */
    readonly romProvider: IRomProvider = new NoopRomProvider();

    /**
     * The ROM device used by the virtual machine
     */
    readonly romDevice: IRomDevice = new NoopRomDevice();

    /**
     * The configuration of the memory
     */
    readonly memoryConfiguration: IMemoryConfiguration = new MemoryConfigurationData();

    /**
     * The memory device used by the virtual machine
     */
    readonly memoryDevice: IMemoryDevice = new NoopMemoryDevice(); 

    /**
     * The port device used by the virtual machine
     */
    readonly portDevice: IPortDevice; 

    /**
     * The configuration of the screen
     */
    readonly screenConfiguration: ScreenConfiguration = new ScreenConfiguration(new ScreenConfigurationData());

    /**
     * The ULA device that renders the VM screen
     */
    readonly screenDevice: IScreenDevice = new NoopScreenDevice();

    /**
     * The ULA device that takes care of raising interrupts
     */
    readonly interruptDevice: IInterruptDevice;

    /**
     * The current status of the keyboard
     */
    readonly keyboardDevice: IKeyboardDevice = new NoopKeyboardDevice();

    /**
     * The provider that handles the keyboard
     */
    readonly keyboardProvider: IKeyboardProvider = new NoopKeyboardProvider();

    /**
     * The beeper device attached to the VM
     */
    readonly beeperDevice: IBeeperDevice = new NoopBeeperDevice();

    /**
     * The sound device attached to the VM
     */
    readonly soundDevice: ISoundDevice | undefined;

    /**
     * The tape device attached to the VM
     */
    readonly tapeDevice: ITapeDevice = new NoopTapeDevice();

    /**
     * The tape provider attached to the VM
     */
    readonly tapeProvider: ITapeProvider = new NoopTapeProvider();

    /**
     * The device that implements the Spectrum Next feature set
     */
    readonly nextDevice: INextFeatureSetDevice | undefined;

    /**
     * The optional DivIDE device
     */
    readonly divIdeDevice: IDivIdeDevice | undefined;

    /**
     * The configuration of the floppy
     */
    readonly floppyConfiguration: IFloppyConfiguration | undefined;

    /**
     * The optional Floppy device
     */
    readonly floppyDevice: IFloppyDevice | undefined;

    /**
     * Debug info provider object
     */
    debugInfoProvider: ISpectrumDebugInfoProvider | undefined;

    /**
     * #of frames rendered
     */
    frameCount = 0;

    /**
     * #of tacts within the frame
     */
    get frameTacts(): number {
        return this._frameTacts;
    }

    /**
     * Gets the frequency of the virtual machine's clock in Hz
     */
    baseClockFrequency = 3_500_000;

    /**
     * Gets the current frame tact according to the CPU tick count
     */
    get currentFrameTact(): number {
        return Math.floor((this.cpu.tacts - this.lastFrameStartCpuTick)/this.clockMultiplier);
    } 

    /**
     * Overflow from the previous frame, given in #of tacts 
     */
    overflow = 0;

    /**
     * The number of frame tact at which the interrupt signal is generated
     */
    get interruptTact(): number {
        return this.screenConfiguration.interruptTact;
    }

    /**
     * Allows to set a clock frequency multiplier value (1, 2, 4, or 8).
     */
    readonly clockMultiplier: number;

    /**
     * Initializes a class instance using a collection of devices
     * @param deviceData Devices to be used with the virtual machine
     */
    constructor(deviceData: DeviceInfoCollection, ulaIssue = "3") {
        this.deviceData = deviceData;
        this.ulaIssue = ulaIssue === "3" ? "3" : "2";

        // --- Check for Spectrum Next
        const nextInfo = this.getDeviceInfo(DT_NEXTFS);
        if (nextInfo && nextInfo.device) {
            this.nextDevice = nextInfo.device as INextFeatureSetDevice;
        }
        
        // --- Prepare the memory device
        const memoryInfo = this.getDeviceInfo(DT_MEMORY);
        if (memoryInfo) {
            this.memoryConfiguration = memoryInfo.configurationData as IMemoryConfiguration;
            if (memoryInfo.device) {
                this.memoryDevice = memoryInfo.device as IMemoryDevice;
            } else {
                this.memoryDevice = new Spectrum48MemoryDevice();
            }
        }

        // --- Prepare the port device
        const portInfo = this.getDeviceInfo(DT_PORT);
        if (portInfo && portInfo.device) {
            this.portDevice = portInfo.device as IPortDevice;
        } else {
            this.portDevice = new Spectrum48PortDevice();
        }

        // --- Init the CPU 
        const cpuConfig = this.getDeviceConfiguration(DT_CPU) as ICpuConfiguration;
        let mult = 1;
        if (cpuConfig) {
            this.baseClockFrequency = cpuConfig.baseClockFrequency;
            mult = cpuConfig.clockMultiplier;
            if (mult < 1) { 
                mult = 1;
            } else if (mult >= 2 && mult <= 3) {
                mult = 2;
            } else if (mult >= 4 && mult <= 7) {
                mult = 4;
            } else if (mult > 8) {
                mult = 8;
            }
        }
        this.clockMultiplier = mult;
        this.cpu = new Z80Cpu(this.memoryDevice, 
            this.portDevice, 
            (cpuConfig && cpuConfig.supportsNextOperations 
                ? cpuConfig.supportsNextOperations : false),
            this.nextDevice);
        this.cpu.useGateArrayContention =
             this.memoryConfiguration.contentionType === MemoryContentionType.GateArray;

        // --- Init the ROM
        const romInfo = this.getDeviceInfo(DT_ROM);
        if (romInfo) {
            if (romInfo.provider) {
                this.romProvider = romInfo.provider as IRomProvider;
            }
            if (romInfo.device) {
                this.romDevice = romInfo.device as IRomDevice;
            } else {
                this.romDevice = new SpectrumRomDevice();
            }
            this.romConfiguration = romInfo.configurationData as IRomConfiguration;
        } else {
            this.romConfiguration = new RomConfigurationData();
        }

        // --- Init the screen device
        const screenInfo = this.getDeviceInfo(DT_SCREEN);
        let pixelRenderer: IScreenFrameProvider = new NoopScreenFrameProvider();
        if (screenInfo) {
            if (screenInfo.provider) {
                pixelRenderer = screenInfo.provider as IScreenFrameProvider;
            }
            if (screenInfo.configurationData) {
                this.screenConfiguration = new ScreenConfiguration(screenInfo.configurationData as IScreenConfiguration);
            }
            if (screenInfo.device) {
                this.screenDevice = screenInfo.device as IScreenDevice;
            } else {
                this.screenDevice = new Spectrum48ScreenDevice();
            }
        } else {
            this.screenDevice = new Spectrum48ScreenDevice();
        }

        // --- Init the beeper device
        const beeperInfo = this.getDeviceInfo(DT_BEEPER);
        if (beeperInfo) {
            if (beeperInfo.device) {
                this.beeperDevice = beeperInfo.device as IBeeperDevice;
            } else {
                this.beeperDevice = new BeeperDevice();
            }
        }

        // --- Init the keyboard device
        const keyboardInfo = this.getDeviceInfo(DT_KEYBOARD);
        if (keyboardInfo) {
            if (keyboardInfo.provider) {
                this.keyboardProvider = keyboardInfo.provider as IKeyboardProvider;
            }
            if (keyboardInfo.device) {
                this.keyboardDevice = keyboardInfo.device as IKeyboardDevice;
            } else {
                this.keyboardDevice = new KeyboardDevice();
            }
        }

        // --- Init the interrupt device
        this.interruptDevice = new InterruptDevice(this.interruptTact);

        // --- Init the tape device
        const tapeInfo = this.getDeviceInfo(DT_TAPE);
        if (tapeInfo) {
            if (tapeInfo.provider) {
                this.tapeProvider = tapeInfo.provider as ITapeProvider;
            }
            if (tapeInfo.device) {
                this.tapeDevice = tapeInfo.device as ITapeDevice;
            } else {
                this.tapeDevice = new TapeDevice(this.tapeProvider);
            }
        }

        // === Init optional devices
        // --- Init the sound device
        const soundInfo = this.getDeviceInfo(DT_SOUND);
        if (soundInfo) {
            if (soundInfo.device) {
                this.soundDevice = soundInfo.device as ISoundDevice;
            }
        }

        // --- Init the DivIDE device
        const divIdeInfo = this.getDeviceInfo(DT_DIVIDE);
        if (divIdeInfo) {
            // TODO: Set the DivIdeDevice
        }

        // --- Init the floppy device
        const floppyInfo = this.getDeviceInfo(DT_FLOPPY);
        if (floppyInfo) {
            this.floppyDevice = floppyInfo.device as IFloppyDevice;
            if (floppyInfo.configurationData) {
                this.floppyConfiguration = floppyInfo.configurationData as IFloppyConfiguration;
            }
        }

        // --- Carry out frame calculations
        this.resetUlaTact();
        this._frameTacts = this.screenConfiguration.screenRenderingFrameTactCount;
        this.frameCount = 0;
        this.overflow = 0;
        this._frameCompleted = true;
        this._lastBreakpoint = undefined;

        // --- Attach providers
        this.attachProvider(this.romProvider);
        this.attachProvider(pixelRenderer);
        this.attachProvider(this.keyboardProvider);
        this.attachProvider(this.tapeProvider);
        if (this.debugInfoProvider) {
            this.attachProvider(this.debugInfoProvider);
        }
            
        // --- Collect Spectrum devices
        this._spectrumDevices.push(this.romDevice);
        this._spectrumDevices.push(this.memoryDevice);
        this._spectrumDevices.push(this.portDevice);
        this._spectrumDevices.push(this.screenDevice);
        this._spectrumDevices.push(this.beeperDevice);
        this._spectrumDevices.push(this.keyboardDevice);
        this._spectrumDevices.push(this.interruptDevice);
        this._spectrumDevices.push(this.tapeDevice);

        // --- Collect optional devices
        if (this.soundDevice) {
            this._spectrumDevices.push(this.soundDevice);
        }
        if (this.nextDevice) {
            this._spectrumDevices.push(this.nextDevice);
        }
        if (this.divIdeDevice) {
            this._spectrumDevices.push(this.divIdeDevice);
        }
        if (this.floppyDevice) {
            this._spectrumDevices.push(this.floppyDevice);
        }

        // --- Now, prepare devices to find each other
        for (const device of this._spectrumDevices) {
            device.onAttachedToVm(this);
        }

        // --- Prepare bound devices
        this._frameBoundDevices = [
            this.screenDevice as IFrameBoundDevice,
            this.interruptDevice as IFrameBoundDevice,
            this.keyboardDevice as IFrameBoundDevice,
            this.beeperDevice as IFrameBoundDevice
        ];
        if (this.soundDevice) {
            this._frameBoundDevices.push(this.soundDevice as IFrameBoundDevice);
        }

        this._cpuBoundDevices = [
            this.tapeDevice as ICpuOperationBoundDevice
        ];

        //this.debugInfoProvider = new SpectrumDebugInfoProvider();

        // --- Init the ROM
        this.initRom(this.romDevice, this.romConfiguration);
    }

    /**
     * Attach the specified provider to this VM
     * @param provider 
     */
    private attachProvider(provider: IVmComponentProvider): void {
        provider.onAttachedToVm(this);
    }

    /**
     * Gets the device with the provided type
     */
    getDeviceInfo(key: string): 
        IDeviceInfo<IDevice, IDeviceConfiguration, IVmComponentProvider> | undefined {
        return this.deviceData.get(key);
    }

    /**
     * Gets the configuration of the device with the provided type
     * @param key Device key
     */
    getDeviceConfiguration(key: string): IDeviceConfiguration | undefined {
        const deviceInfo = this.deviceData.get(key);
        if (deviceInfo) {
            return deviceInfo.configurationData;
        }
        return undefined;
    }

    /**
     * Resets the CPU and the ULA chip
     */
    reset(): void {
        this.cpu.setResetSignal();
        this.resetUlaTact();
        this.frameCount = 0;
        this.overflow = 0;
        this.lastFrameStartCpuTick = 0;
        this.lastExecutionStartTact = 0;
        this.contentionAccumulated = 0;
        this.lastExecutionContentionValue = 0;
        this._frameCompleted = true;
        this.cpu.reset();
        this.cpu.releaseResetSignal();
        for (const device of this._spectrumDevices) {
            device.reset();
        }
        if (this.debugInfoProvider) {
            this.debugInfoProvider.imminentBreakpoint = undefined;
        }
    }

    /**
     * Gets the current state of the device
     */
    getDeviceState(): any {
        return undefined;
    }

    /**
     * Restores the state of the device from the specified object
     * @param state Device state
     */
    restoreDeviceState(state: any): void {
    }


    /**
     * Allow the device to react to the start of a new frame
     */
    onNewFrame(): void {
        for (const device of this._frameBoundDevices) {
            device.onNewFrame();
        }
    }

    /**
     * Allow the device to react to the completion of a frame
     */
    onFrameCompleted(): void {
        for (const device of this._frameBoundDevices) {
            device.overflow = this.overflow;
            device.onFrameCompleted();
        }
    }

    /**
     * Allow external entities respond to frame completion
     */
    get frameCompleted(): LiteEvent<void> {
        return this._frameCompletedEvent;
    }

    /**
     * Resets the ULA tact to start screen rendering from the beginning
     */
    resetUlaTact(): void {
        this.lastRenderedUlaTact = -1;
    }

    /**
     * Sets the debug info provider to the specified object
     * @param provider Provider object
     */
    setDebugInfoProvider(provider: ISpectrumDebugInfoProvider): void {
        this.debugInfoProvider = provider;
    }

    /**
     * Gets diagnostics information about the machine
     */
    getDiagInfo(): RegisterDiagInfo {
        const d = new RegisterDiagInfo();
        d.af = this.cpu.af;
        d.bc = this.cpu.bc;
        d.de = this.cpu.de;
        d.hl = this.cpu.hl;
        d._af_ = this.cpu._af_;
        d._bc_ = this.cpu._bc_;
        d._de_ = this.cpu._de_;
        d._hl_ = this.cpu._hl_;
        d.sp = this.cpu.sp;
        d.pc = this.cpu.pc;
        d.ix = this.cpu.ix;
        d.iy = this.cpu.iy;
        d.ir = this.cpu.ir;
        d.wz = this.cpu.wz;

        d.im = this.cpu.interruptMode;
        d.if1 = this.cpu.iff1;
        d.if2 = this.cpu.iff2;
        d.hlt = (this.cpu.stateFlags & Z80StateFlags.Halted) !== 0;

        d.clk = this.cpu.tacts;
        d.stp = this.cpu.tacts - this.lastExecutionStartTact;
        d.del = this.contentionAccumulated;
        d.lco = this.contentionAccumulated - this.lastExecutionContentionValue;

        d.frm = this.screenDevice.frameCount;
        const ulaTacts = this.screenConfiguration.screenRenderingFrameTactCount;
        const currentTact = this.currentFrameTact % ulaTacts;
        d.fcl = currentTact ;
        d.ras = Math.floor(currentTact / this.screenConfiguration.screenLineTime);
        const rt = this.screenDevice.renderingTactTable[currentTact];
        d.con = rt.contentionDelay;
        switch (rt.phase) {
            case ScreenRenderingPhase.None:
                d.pix = "None";
                break;
            case ScreenRenderingPhase.Border:
                d.pix = "Border";
                break;
            case ScreenRenderingPhase.BorderFetchPixel:
                d.pix = "Border (fetch byte)";
                break;
            case ScreenRenderingPhase.BorderFetchPixelAttr:
                d.pix = "Border (fetch attr)";
                break;
            case ScreenRenderingPhase.DisplayB1:
                d.pix = "Byte #1";
                break;
            case ScreenRenderingPhase.DisplayB1FetchA2:
                d.pix = "Byte #1/Fetch Attr #2";
                break;
            case ScreenRenderingPhase.DisplayB1FetchB2:
                d.pix = "Byte #1/Fetch Byte #2";
                break;
            case ScreenRenderingPhase.DisplayB2:
                d.pix = "Byte #2";
                break;
            case ScreenRenderingPhase.DisplayB2FetchA1:
                d.pix = "Byte #2/Fetch Attr #1";
                break;
            case ScreenRenderingPhase.DisplayB2FetchB1:
                d.pix = "Byte #2/Fetch Byte #1";
                break;
        }
        return d;
    }

    /**
     * The main execution cycle of the Spectrum VM
     * @param token Cancellation token
     * @param options Execution options
     * @returns True, if the cycle completed; false, if it has been cancelled
     */
    executeCycle(token: CancellationToken, options: ExecuteCycleOptions): boolean {
        this.executeCycleOptions = options;
        this.executionCompletionReason = ExecutionCompletionReason.None;
        if (options.emulationMode !== EmulationMode.UntilFrameEnds) {
            this.lastExecutionStartTact = this.cpu.tacts;
            this.lastExecutionContentionValue = this.contentionAccumulated;
        }

        // --- We use these variables to calculate wait time at the end of the frame
        const cycleStartTact = this.cpu.tacts;

        // --- We use this variable to check whether to stop in Debug mode
        let executedInstructionCount = -1;

        // --- Loop #1: The main cycle that goes on until cancelled
        while (!token.isCancellationRequested) {
            if (this._frameCompleted) {
                // --- This counter helps us to calculate where we are in the frame after
                // --- each CPU operation cycle
                this.lastFrameStartCpuTick = this.cpu.tacts - this.overflow;

                // --- Notify devices to start a new frame
                this.onNewFrame();
                this.lastRenderedUlaTact = this.overflow;
                this._frameCompleted = false;
            }

            // --- Loop #2: The physical frame cycle that goes on while CPU and ULA 
            // --- processes everything whithin a physical frame (0.019968 second)
            while (!this._frameCompleted) {
                // --- Check debug mode when a CPU instruction has been entirelly executed
                if (!this.cpu.isInOpExecution) {
                    // --- Check for cancellation
                    if (token.isCancellationRequested) {
                        this.executionCompletionReason = ExecutionCompletionReason.Cancelled;
                        return false;
                    }

                    // --- The next instruction is about to be executed
                    executedInstructionCount++;

                    // --- Check for timeout
                    if (options.timeoutTacts > 0 
                        && cycleStartTact + options.timeoutTacts < this.cpu.tacts) {
                        this.executionCompletionReason = ExecutionCompletionReason.Timeout;
                        return false;
                    }

                    // --- Check for reaching the termination point
                    if (options.emulationMode === EmulationMode.UntilExecutionPoint) {
                        if (options.terminationPoint < 0x4000) {
                            // --- ROM & address must match
                            if (options.terminationRom === this.memoryDevice.getSelectedRomIndex()
                                && options.terminationPoint === this.cpu.pc) {
                                // --- We reached the termination point within ROM
                                this.executionCompletionReason = ExecutionCompletionReason.TerminationPointReached;
                                return true;
                            }
                        }
                        else if (options.terminationPoint === this.cpu.pc) {
                            // --- We reached the termination point within RAM
                            this.executionCompletionReason = ExecutionCompletionReason.TerminationPointReached;
                            return true;
                        }
                    }

                    // --- Check for a debugging stop point
                    if (options.emulationMode === EmulationMode.Debugger) {
                        if (this.isDebugStop(options, executedInstructionCount)) {
                            // --- At this point, the cycle should be stopped because of debugging reasons
                            // --- The screen should be refreshed
                            this.screenDevice.onFrameCompleted();
                            this.executionCompletionReason = ExecutionCompletionReason.BreakpointReached;
                            return true;
                        }
                    }
                }

                // --- Check for interrupt signal generation
                this.interruptDevice.checkForInterrupt(this.currentFrameTact);

                // --- Run a single Z80 instruction
                this.cpu.executeCpuCycle();
                this._lastBreakpoint = undefined;

                // --- Run a rendering cycle according to the current CPU tact count
                const lastTact = this.currentFrameTact;
                this.screenDevice.renderScreen(this.lastRenderedUlaTact + 1, lastTact);
                this.lastRenderedUlaTact = lastTact;

                // --- Exit if the emulation mode specifies so
                if (options.emulationMode === EmulationMode.UntilHalt 
                    && (this.cpu.stateFlags & Z80StateFlags.Halted) !== 0) {
                    this.executionCompletionReason = ExecutionCompletionReason.Halted;
                    return true;
                }

                // --- Notify each CPU-bound device that the current operation has been completed
                for (const device of this._cpuBoundDevices) {
                    device.onCpuOperationCompleted();
                }

                // --- Decide whether this frame has been completed
                this._frameCompleted = !this.cpu.isInOpExecution 
                    && this.currentFrameTact >= this._frameTacts;

            } // -- End Loop #2

            // --- A physical frame has just been completed. Take care about screen refresh
            this.frameCount++;

            // --- Notify devices that the current frame completed
            this.onFrameCompleted();

            // --- Start a new frame and carry on
            this.overflow = this.currentFrameTact % this._frameTacts;

            // --- Exit if the emulation mode specifies so
            if (options.emulationMode === EmulationMode.UntilFrameEnds 
                || options.emulationMode === EmulationMode.Debugger) {
                this.executionCompletionReason = ExecutionCompletionReason.FrameCompleted;
                return true;
            }

        } // --- End Loop #1

        // --- The cycle has been interrupted by cancellation
        this.executionCompletionReason = ExecutionCompletionReason.Cancelled;
        return false;
    }

    /**
     * Checks whether the execution cycle should be stopped for debugging
     * @param options Execution options
     * @param executedInstructionCount Count of executed instructions
     * @returns True, if the execution should be stopped
     */
    isDebugStop(options: ExecuteCycleOptions, executedInstructionCount: number): boolean {
        // --- No debug provider, no stop
        if (!this.debugInfoProvider) {
            return false;
        }

        // --- In Step-Into mode we always stop when we're about to
        // --- execute the next instruction
        if (options.debugStepMode === DebugStepMode.StepInto) {
            return executedInstructionCount > 0;
        }

        // --- In Stop-At-Breakpoint mode we stop only if a predefined
        // --- breakpoint is reached
        if (options.debugStepMode === DebugStepMode.StopAtBreakpoint
            && this.debugInfoProvider.shouldBreakAtAddress(this.cpu.pc)) {
            if (executedInstructionCount > 0
                || !this._lastBreakpoint
                || this._lastBreakpoint !== this.cpu.pc) {
                // --- If we are paused at a breakpoint, we do not want
                // --- to pause again and again, unless we step through
                this._lastBreakpoint = this.cpu.pc;
                return true;
            }
        }

        // --- We're in Step-Over mode
        if (options.debugStepMode === DebugStepMode.StepOver) {
            if (this.debugInfoProvider.imminentBreakpoint) {
                // --- We also stop, if an imminent breakpoint is reached, and also remove
                // --- this breakpoint
                if (this.debugInfoProvider.imminentBreakpoint === this.cpu.pc) {
                    this.debugInfoProvider.imminentBreakpoint = undefined;
                    return true;
                }
            } else {
                let imminentJustCreated = false;

                // --- We check for a CALL-like instruction
                const length = this.cpu.getCallInstructionLength();
                if (length > 0) {
                    // --- Its a CALL-like instraction, create an imminent breakpoint
                    this.debugInfoProvider.imminentBreakpoint = (this.cpu.pc + length) & 0xFFFF;
                    imminentJustCreated = true;
                }

                // --- We stop, we executed at least one instruction and if there's no imminent 
                // --- breakpoint or we've just created one
                if (executedInstructionCount > 0
                    && (!this.debugInfoProvider.imminentBreakpoint || imminentJustCreated)) {
                    return true;
                }
            }
        }

        // --- In any other case, we carry on
        return false;
    }

    /**
     * This flag tells if the frame has just been completed.
     */
    get hasFrameCompleted(): boolean {
        return this._frameCompleted;
    }

    /**
     * Writes a byte to the memory
     * @param addr Memory address
     * @param value Data byte
     */
    writeSpectrumMemory(addr: number, value: number): void {
        this.memoryDevice.write(addr, value);
    }
            
    /**
     * Sets the ULA frame tact for testing purposes
     * @param tacts ULA frame tact to set
     */
    setUlaFrameTact(tacts: number): void {
        this.lastRenderedUlaTact = tacts;
        // TODO: Fix this code
        // const cpuTest = this.Cpu as IZ80CpuTestSupport;
        //     cpuTest?.SetTacts(tacts);
        //     _frameCompleted = tacts == 0;
    }

    /**
     * Injects code into the memory
     * @param addr Start address
     * @param code Code to inject
     * The code leaves the ROM area untouched.
     */
    injectCodeToMemory(addr: number, code: Uint8Array): void {
        for (const codeByte of code) {
            this.memoryDevice.write(addr++, codeByte);
        }
    }

    /**
     * Prepares the custom code for running, as if it were started
     * with the RUN command
     */
    prepareRunMode(): void {
        // --- Set the keyboard in "L" mode
        let flags = this.memoryDevice.read(0x5C3B);
        flags |= 0x08;
        this.memoryDevice.write(0x5C3B, flags);
    }

    /**
     * Loads the content of the ROM through the specified provider
     * @param romDevice ROM device instance
     * @param romConfig ROM configuration
     * The content of the ROM is copied into the memory
     */
    initRom(romDevice: IRomDevice, romConfig: IRomConfiguration): void {
        for (let i = 0; i < romConfig.numberOfRoms; i++) {
            this.memoryDevice.selectRom(i);
            this.memoryDevice.copyRom(romDevice.getRomBytes(i));
        }
        this.memoryDevice.selectRom(0);
    }
}
