import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_MEMORY } from "../DeviceTypes";

export abstract class MemoryDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_MEMORY;
    }
}