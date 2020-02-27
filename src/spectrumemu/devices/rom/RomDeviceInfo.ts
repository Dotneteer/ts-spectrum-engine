import { DeviceInfoBase } from "../DeviceInfoBase";
import { IRomDevice } from "../../abstraction/IRomDevice";
import { IRomConfiguration } from "../../abstraction/IRomConfiguration";
import { IRomProvider } from "../../abstraction/IRomProvider";

/**
 * This class describes configuration information for the ROM device.
 */
export class RomDeviceInfo extends DeviceInfoBase<IRomDevice, IRomConfiguration, IRomProvider> {
        /// <summary>
        /// Initializes a new instance of the <see cref="T:System.Object" /> class.
        /// </summary>
        /// <param name="provider">Optional provider instance</param>
        /// <param name="configurationData">Optional configuration information</param>
        /// <param name="device">Device instance</param>
    constructor(provider: IRomProvider, configurationData: IRomConfiguration, device: IRomDevice) {
        super(provider, configurationData, device);
    }
}