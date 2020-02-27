import { DeviceInfoBase } from "../DeviceInfoBase";
import { IScreenDevice } from "../../abstraction/IScreenDevice";
import { IScreenConfiguration } from "../../abstraction/IScreenConfiguration";
import { IScreenFrameProvider } from "../../abstraction/IScreenFrameProvider";
import { Spectrum48ScreenDevice } from "./Spectrum48ScreenDevice";

/**
 * This class describes configuration information for the screen device.
 */
export class ScreenDeviceInfo extends DeviceInfoBase<IScreenDevice, IScreenConfiguration, IScreenFrameProvider> {
    constructor(configurationData: IScreenConfiguration, provider?: IScreenFrameProvider, device?: IScreenDevice) {
        super(provider, configurationData, device ? device :  new Spectrum48ScreenDevice());
    }
}