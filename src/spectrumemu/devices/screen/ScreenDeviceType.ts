import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_SCREEN } from "../DeviceTypes";

export abstract class ScreenDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_SCREEN;
    }
}