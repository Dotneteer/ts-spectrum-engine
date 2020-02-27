import { IDeviceInfo } from "../abstraction/IDeviceInfo";
import { IDevice } from "../abstraction/IDevice";
import { IDeviceConfiguration } from "../abstraction/IDeviceConfiguration";
import { IVmComponentProvider } from "../abstraction/IVmComponentProvider";

/**
 * This class provides a collection of device information for a particular
 * ZX Spectrum virtual machine
 */
export class DeviceInfoCollection {
    private _coll = new Map<string, IDeviceInfo<IDevice, IDeviceConfiguration, IVmComponentProvider>>();

    /**
     * Adds device information using the device type as the key in the map
     * @param deviceInfo Device information
     */
    add(deviceInfo: IDeviceInfo<IDevice, IDeviceConfiguration, IVmComponentProvider>): void {
        if (deviceInfo.device) {
            this._coll.set(deviceInfo.device.key, deviceInfo);
        }
    }

    /**
     * Gets the device information from the map
     * @param device Device type
     */
    get(key: string): IDeviceInfo<IDevice, IDeviceConfiguration, IVmComponentProvider> | undefined {
        return this._coll.get(key);
    }
}