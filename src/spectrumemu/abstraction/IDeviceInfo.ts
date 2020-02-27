import { IDevice } from "./IDevice";
import { IDeviceConfiguration } from "./IDeviceConfiguration";
import { IVmComponentProvider } from "./IVmComponentProvider";

/// <summary>
    /// This interface couples a particular device with its configuration
    /// information and provider.
    /// </summary>
    /// <typeparam name="TDevice">Device type</typeparam>
    /// <typeparam name="TConfig">Configuration type</typeparam>
    /// <typeparam name="TProvider">Provider type</typeparam>
export interface IDeviceInfo<TDevice extends IDevice, 
    TConfig extends IDeviceConfiguration, 
    TProvider extends IVmComponentProvider>  {

    /**
     * The optional device instance.
     * If not provided, the virtual machine may ignore this device,
     * or use its default one.
     */
    readonly device: TDevice | undefined;

    /** 
     * Optional configuration object for the device
     */
    readonly configurationData: TConfig | undefined;

    /**
     * Optional provider for the device
     */
    readonly provider: TProvider | undefined;
}