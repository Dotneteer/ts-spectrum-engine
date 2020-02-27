import { DeviceInfoBase } from "../DeviceInfoBase";
import { IBeeperDevice } from "../../abstraction/IBeeperDevice";
import { BeeperDevice } from "./BeeperDevice";
import { INoProvider } from "../INoProvider";
import { INoConfiguration } from "../INoConfiguration";

/**
 * This class describes configuration information for the beeper device.
 */
export class BeeperDeviceInfo extends DeviceInfoBase<IBeeperDevice, INoConfiguration, INoProvider> {
    constructor() {
        super(undefined, undefined, new BeeperDevice());
    }
}