import { DeviceTypeBase } from "../abstraction/DeviceTypeBase";
import { DT_CPU } from "../devices/DeviceTypes";

export abstract class CpuDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_CPU;
    }
}