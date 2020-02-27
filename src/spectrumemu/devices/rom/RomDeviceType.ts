import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_ROM } from "../DeviceTypes";

export abstract class RomDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_ROM;
    }
}