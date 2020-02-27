import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_SOUND } from "../DeviceTypes";

export abstract class SoundDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_SOUND;
    }
}