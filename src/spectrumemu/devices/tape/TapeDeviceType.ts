import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_TAPE } from "../DeviceTypes";

export abstract class TapeDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_TAPE;
    }
}