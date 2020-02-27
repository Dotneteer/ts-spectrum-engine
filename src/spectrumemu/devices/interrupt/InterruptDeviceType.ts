import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_INTERRUPT } from "../DeviceTypes";

export abstract class InterruptDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_INTERRUPT;
    }
}