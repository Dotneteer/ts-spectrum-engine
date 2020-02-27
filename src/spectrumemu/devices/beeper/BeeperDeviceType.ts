import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_BEEPER } from "../DeviceTypes";

export abstract class BeeperDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_BEEPER;
    }
}