import { DeviceInfoBase } from "../DeviceInfoBase";
import { IMemoryDevice } from "../../abstraction/IMemoryDevice";
import { IMemoryConfiguration } from "../../abstraction/IMemoryConfiguration";
import { INoProvider } from "../INoProvider";

/**
 * This class describes configuration information for the memory.
 */
export class MemoryDeviceInfo extends DeviceInfoBase<IMemoryDevice, IMemoryConfiguration, INoProvider> {
    constructor(configurationData: IMemoryConfiguration, device: IMemoryDevice) {
        super(undefined, configurationData, device);
    }
}