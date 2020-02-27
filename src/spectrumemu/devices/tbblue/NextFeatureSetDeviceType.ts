import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_NEXTFS } from "../DeviceTypes";

export abstract class NextFeatureSetDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_NEXTFS;
    }
}