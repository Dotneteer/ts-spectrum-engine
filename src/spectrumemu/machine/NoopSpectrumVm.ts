import { ISpectrumVm } from "../abstraction/ISpectrumVm";
import { IDeviceInfo } from "../abstraction/IDeviceInfo";
import { IDeviceConfiguration } from "../abstraction/IDeviceConfiguration";
import { IVmComponentProvider } from "../abstraction/IVmComponentProvider";
import { IDevice } from "../abstraction/IDevice";
import { ITapeDevice } from "../abstraction/ITapeDevice";
import { IScreenDevice } from "../abstraction/IScreenDevice";
import { ScreenConfiguration } from "../devices/screen/ScreenConfiguration";
import { NoopZ80Cpu } from "../cpu/NoopZ80Cpu";
import { NoopBeeperDevice } from "../devices/beeper/NoopBeeperDevice";
import { NoopKeyboardDevice } from "../devices/keyboard/NoopKeyboardDevice";
import { NoopKeyboardProvider } from "../devices/keyboard/NoopKeyboardProvider";
import { NoopMemoryDevice } from "../devices/memory/NoopMemoryDevice";
import { MemoryConfigurationData } from "../devices/memory/MemoryConfigurationData";
import { NoopPortDevice } from "../devices/ports/NoopPortDevice";
import { NoopScreenDevice } from "../devices/screen/NoopScreenDevice";
import { ScreenConfigurationData } from "../devices/screen/ScreenConfigurationData";
import { ExecuteCycleOptions } from "./ExecuteCycleOptions";
import { IMemoryDevice } from "../abstraction/IMemoryDevice";
import { IPortDevice } from "../abstraction/IPortDevice";
import { IBeeperDevice } from "../abstraction/IBeeperDevice";
import { IKeyboardDevice } from "../abstraction/IKeyboardDevice";
import { IKeyboardProvider } from "../abstraction/IKeyboardProvider";
import { ExecutionCompletionReason } from "./ExecutionCompletionReason";
import { DeviceInfoCollection } from "./DeviceInfoCollection";
import { RomConfigurationData } from "../devices/rom/RomConfigurationData";
import { NoopRomProvider } from "../devices/rom/NoopRomProvider";
import { IRomProvider } from "../abstraction/IRomProvider";
import { NoopRomDevice } from "../devices/rom/NoopRomDevice";
import { IRomDevice } from "../abstraction/IRomDevice";
import { IInterruptDevice } from "../abstraction/IInterruptDevice";
import { NoopInterruptDevice } from "../devices/interrupt/NoopInterruptDevice";
import { ISoundDevice } from "../abstraction/ISoundDevice";
import { ITapeProvider } from "../abstraction/ITapeProvider";
import { INextFeatureSetDevice } from "../abstraction/INextFeatureSetDevice";
import { IDivIdeDevice } from "../abstraction/IDivIdeDevice";
import { IFloppyConfiguration } from "../abstraction/IFloppyConfiguration";
import { IFloppyDevice } from "../abstraction/IFloppyDevice";
import { ISpectrumDebugInfoProvider } from "../abstraction/ISpectrumDebugInfoProvider";
import { NoopTapeProvider } from "../devices/tape/NoopTapeProvider";
import { RegisterDiagInfo } from "./RegisterDiagInfo";
import { LiteEvent } from "../utils/LiteEvent";
import { CancellationToken } from "../utils/CancellationToken";

/**
 * Non-operating (dummy) Spectrum virtual machine device
 */
export class NoopSpectrumVm implements ISpectrumVm {
    readonly key = "SpectrumVm";
    reset(): void {}
    getDeviceState(): any {}
    restoreDeviceState(state: any): void {}
    readonly frameCount = 0;
    overflow = 0;
    onNewFrame(): void {}
    onFrameCompleted(): void {}
    readonly frameCompleted: LiteEvent<void> = new LiteEvent<void>();
    getDeviceInfo(key: string): 
        IDeviceInfo<IDevice, IDeviceConfiguration, IVmComponentProvider> | undefined {
        return undefined;
    }
    constructor() {
        this.memoryDevice = new NoopMemoryDevice(this); 
        this.portDevice = new NoopPortDevice(this);
        this.beeperDevice = new NoopBeeperDevice(this);
        this.keyboardDevice = new NoopKeyboardDevice(this);
        this.keyboardProvider = new NoopKeyboardProvider(this);
        this.screenDevice = new NoopScreenDevice(this);
        this.romProvider = new NoopRomProvider(this);
        this.romDevice = new NoopRomDevice(this);
        this.interruptDevice = new NoopInterruptDevice(this);
        this.tapeProvider = new NoopTapeProvider(this);
    }

    readonly cpu = new NoopZ80Cpu();
    readonly ulaIssue = "3";
    readonly baseClockFrequency = 0;
    readonly currentFrameTact = 0;
    readonly frameTacts = 0;
    readonly memoryDevice: IMemoryDevice; 
    readonly memoryConfiguration = new MemoryConfigurationData();
    readonly portDevice: IPortDevice;
    readonly beeperDevice: IBeeperDevice;
    readonly keyboardDevice: IKeyboardDevice;
    readonly keyboardProvider: IKeyboardProvider;
    readonly tapeDevice: ITapeDevice | undefined;
    readonly screenDevice: IScreenDevice;
    readonly screenConfiguration = new ScreenConfiguration(new ScreenConfigurationData());
    contentionAccumulated = 0;
    readonly executeCycleOptions = new ExecuteCycleOptions();
    readonly executionCompletionReason = ExecutionCompletionReason.None;
    readonly deviceData = new DeviceInfoCollection();
    readonly lastExecutionStartTact = 0;
    readonly lastExecutionContentionValue = 0;
    readonly romConfiguration = new RomConfigurationData();
    readonly romProvider: IRomProvider;
    readonly romDevice: IRomDevice;
    readonly interruptDevice: IInterruptDevice;
    readonly soundDevice: ISoundDevice | undefined;
    readonly tapeProvider: ITapeProvider;
    readonly nextDevice: INextFeatureSetDevice | undefined;
    readonly divIdeDevice: IDivIdeDevice | undefined;
    readonly floppyConfiguration: IFloppyConfiguration | undefined;
    readonly floppyDevice: IFloppyDevice | undefined;
    debugInfoProvider: ISpectrumDebugInfoProvider | undefined;
    readonly interruptTact = 0;
    readonly runsInMaskableInterrupt = false;
    readonly clockMultiplier = 0;
    executeCycle(token: CancellationToken, options: ExecuteCycleOptions): boolean { return true; }
    getDiagInfo(): RegisterDiagInfo { return new RegisterDiagInfo(); }
}