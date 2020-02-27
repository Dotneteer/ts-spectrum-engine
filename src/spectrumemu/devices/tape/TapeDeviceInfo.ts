import { DeviceInfoBase } from "../DeviceInfoBase";
import { ITapeDevice } from "../../abstraction/ITapeDevice";
import { INoConfiguration } from "../INoConfiguration";
import { ITapeProvider } from "../../abstraction/ITapeProvider";
import { TapeDevice } from "./TapeDevice";
import { NoopTapeProvider } from "./NoopTapeProvider";

/**
 * This class describes configuration information for the tape device.
 */
export class TapeDeviceInfo extends DeviceInfoBase<ITapeDevice, INoConfiguration, ITapeProvider> {
    constructor(provider: ITapeProvider) {
        super(provider, undefined, 
            new TapeDevice(provider ? provider : new NoopTapeProvider()));
    }
}