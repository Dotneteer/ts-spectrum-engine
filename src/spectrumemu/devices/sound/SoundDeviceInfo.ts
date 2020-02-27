import { DeviceInfoBase } from "../DeviceInfoBase";
import { ISoundDevice } from "../../abstraction/ISoundDevice";
import { INoProvider } from "../INoProvider";
import { SoundDevice } from "./SoundDevice";
import { INoConfiguration } from "../INoConfiguration";

/**
 * This class describes configuration information for the beeper device.
 */
export class SoundDeviceInfo extends DeviceInfoBase<ISoundDevice, INoConfiguration, INoProvider> {
    constructor() {
        super(undefined, undefined, new SoundDevice());
    }
}