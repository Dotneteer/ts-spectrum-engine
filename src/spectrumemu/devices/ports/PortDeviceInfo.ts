import { DeviceInfoBase } from "../DeviceInfoBase";
import { IPortDevice } from "../../abstraction/IPortDevice";
import { INoConfiguration } from "../INoConfiguration";
import { INoProvider } from "../INoProvider";

/**
 * This class describes configuration information for the I/O ports.
 */
export class PortDeviceInfo extends DeviceInfoBase<IPortDevice, INoConfiguration, INoProvider> {
    constructor(device: IPortDevice) {
        super(undefined, undefined, device);
    }
}