import { IDeviceInfo } from "../abstraction/IDeviceInfo";
import { IDevice } from "../abstraction/IDevice";
import { IDeviceConfiguration } from "../abstraction/IDeviceConfiguration";
import { IVmComponentProvider } from "../abstraction/IVmComponentProvider";

/** 
 * This class is intended to be a base class for all device information
 */    
export abstract class DeviceInfoBase<TDevice extends IDevice, 
    TConfig extends IDeviceConfiguration, 
    TProvider extends IVmComponentProvider> implements IDeviceInfo<TDevice, TConfig, TProvider> {
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

    /**
     * Initializes a new instance of this class
     * @param provider Optional provider instance
     * @param configurationData Optional configuration information
     * @param device Optional device instance
     */
    constructor(provider?: TProvider,
        configurationData?: TConfig, 
        device?: TDevice) {
        
        this.device = device;
        this.configurationData = configurationData;
        this.provider = provider;
    }
}