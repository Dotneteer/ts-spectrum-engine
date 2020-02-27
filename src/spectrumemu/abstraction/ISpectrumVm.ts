import { IFrameBoundDevice } from './IFrameBoundDevice';
import { IZ80Cpu } from './IZ80Cpu';
import { IDeviceInfo } from './IDeviceInfo';
import { IDeviceConfiguration } from './IDeviceConfiguration';
import { IVmComponentProvider } from './IVmComponentProvider';
import { IScreenDevice } from './IScreenDevice';
import { IMemoryDevice } from './IMemoryDevice';
import { IPortDevice } from './IPortDevice';
import { IBeeperDevice } from './IBeeperDevice';
import { IKeyboardDevice } from './IKeyboardDevice';
import { ITapeDevice } from './ITapeDevice';
import { IKeyboardProvider } from './IKeyboardProvider';
import { IMemoryConfiguration } from './IMemoryConfiguration';
import { ScreenConfiguration } from '../devices/screen/ScreenConfiguration';
import { ExecuteCycleOptions } from '../machine/ExecuteCycleOptions';
import { ExecutionCompletionReason } from '../machine/ExecutionCompletionReason';
import { DeviceInfoCollection } from '../machine/DeviceInfoCollection';
import { IRomConfiguration } from './IRomConfiguration';
import { IRomProvider } from './IRomProvider';
import { IRomDevice } from './IRomDevice';
import { IInterruptDevice } from './IInterruptDevice';
import { ISoundDevice } from './ISoundDevice';
import { ITapeProvider } from './ITapeProvider';
import { INextFeatureSetDevice } from './INextFeatureSetDevice';
import { IDivIdeDevice } from './IDivIdeDevice';
import { IFloppyConfiguration } from './IFloppyConfiguration';
import { IFloppyDevice } from './IFloppyDevice';
import { ISpectrumDebugInfoProvider } from './ISpectrumDebugInfoProvider';
import { IDevice } from './IDevice';
import { RegisterDiagInfo } from '../machine/RegisterDiagInfo';
import { CancellationToken } from '../utils/CancellationToken';

/**
 * This interface represents a Spectrum virtual machine
 */
export interface ISpectrumVm extends IFrameBoundDevice {
    /**
     * Gets the device with the provided type
     */
    getDeviceInfo(key: string): 
        IDeviceInfo<IDevice, IDeviceConfiguration, IVmComponentProvider> | undefined;
    
    /**
     * The Z80 CPU of the machine
     */
    readonly cpu: IZ80Cpu;

    /**
     * Gets the ULA revision (2/3)
     */
    readonly ulaIssue: string;

    /**
     * Gets the frequency of the virtual machine's clock in Hz
     */
    readonly baseClockFrequency: number;

    /**
     * The current tact within the frame
     */
    readonly currentFrameTact: number;

    /**
     * #of tacts within the frame
     */
    readonly frameTacts: number;

    /**
     * The memory device used by the virtual machine
     */
    readonly memoryDevice: IMemoryDevice; 

    /**
     * The configuration of the memory
     */
    readonly memoryConfiguration: IMemoryConfiguration;

    /**
     * The port device used by the virtual machine
     */
    readonly portDevice: IPortDevice; 

    /**
     * The beeper device attached to the VM
     */
    readonly beeperDevice: IBeeperDevice;

    /**
     * The current status of the keyboard
     */
    readonly keyboardDevice: IKeyboardDevice;

    /**
     * The provider that handles the keyboard
     */
    readonly keyboardProvider: IKeyboardProvider;

    /**
     * The tape device attached to the VM
     */
    readonly tapeDevice: ITapeDevice | undefined;

    /**
     * The ULA device that renders the VM screen
     */
    readonly screenDevice: IScreenDevice;

    /**
     * The configuration of the screen
     */
    readonly screenConfiguration: ScreenConfiguration;

    /**
     * Gets or sets the value of the contention accummulated since the start of 
     * the machine
     */
    contentionAccumulated: number;

    /**
     * The current execution cycle options
     */
    readonly executeCycleOptions: ExecuteCycleOptions;

    /**
     * Gets the reason why the execution cycle of the SpectrumEngine completed.
     */
    readonly executionCompletionReason: ExecutionCompletionReason;

    /**
     * Collection of Spectrum devices
     */
    readonly deviceData: DeviceInfoCollection;

    /**
     * The CPU tact at which the last execution cycle started
     */
    readonly lastExecutionStartTact: number;

    /**
     * Gets the value of the contention accummulated when the 
     * execution cycle started
     */
    readonly lastExecutionContentionValue: number;

    /**
     * The configuration of the ROM
     */
    readonly romConfiguration: IRomConfiguration;

    /**
     * The ROM provider object
     */
    readonly romProvider: IRomProvider;

    /**
     * The ROM device used by the virtual machine
     */
    readonly romDevice: IRomDevice;

    /**
     * The ULA device that takes care of raising interrupts
     */
    readonly interruptDevice: IInterruptDevice;

    /**
     * The sound device attached to the VM
     */
    readonly soundDevice: ISoundDevice | undefined;

    /**
     * The tape provider attached to the VM
     */
    readonly tapeProvider: ITapeProvider;

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
     * The number of frame tact at which the interrupt signal is generated
     */
    readonly interruptTact: number;

    /**
     * Allows to set a clock frequency multiplier value (1, 2, 4, or 8).
     */
    readonly clockMultiplier: number;

    /**
     * The main execution cycle of the Spectrum VM
     * @param token Cancellation token
     * @param options Execution options
     * @returns True, if the cycle completed; false, if it has been cancelled
     */
    executeCycle(token: CancellationToken, options: ExecuteCycleOptions): boolean;

    /**
     * Gets diagnostics information about the machine
     */
    getDiagInfo(): RegisterDiagInfo;
}