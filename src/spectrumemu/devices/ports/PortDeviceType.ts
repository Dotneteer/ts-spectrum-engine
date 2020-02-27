import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_PORT } from "../DeviceTypes";

export abstract class PortDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_PORT;
    }
}