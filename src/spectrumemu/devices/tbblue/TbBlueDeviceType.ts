import { DeviceTypeBase } from "../../abstraction/DeviceTypeBase";
import { DT_TBBLUE } from "../DeviceTypes";

export abstract class TbBlueDeviceType extends DeviceTypeBase {
    /**
     * Device key information
     */
    get key(): string {
        return DT_TBBLUE;
    }
}