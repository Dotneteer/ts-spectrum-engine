import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_KEYBOARD } from "../DeviceTypes";

export abstract class KeyboardDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_KEYBOARD;
    }
}