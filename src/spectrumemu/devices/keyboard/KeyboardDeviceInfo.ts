import { DeviceInfoBase } from "../DeviceInfoBase";
import { IKeyboardDevice } from "../../abstraction/IKeyboardDevice";
import { INoConfiguration } from "../INoConfiguration";
import { IKeyboardProvider } from "../../abstraction/IKeyboardProvider";

/**
 * This class describes configuration information for the keyboard device.
 */
export class KeyboardDeviceInfo extends DeviceInfoBase<IKeyboardDevice, INoConfiguration, IKeyboardProvider> {
    constructor(provider: IKeyboardProvider, device: IKeyboardDevice) {
        super(provider, undefined, device);
    }
}