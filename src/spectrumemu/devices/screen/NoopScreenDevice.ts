import { ScreenDeviceType } from "./ScreenDeviceType";
import { IScreenDevice } from "../../abstraction/IScreenDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { ScreenConfigurationData } from "./ScreenConfigurationData";
import { ScreenConfiguration } from "./ScreenConfiguration";
import { LiteEvent } from "../../utils/LiteEvent";

/**
 * Non-operating (dummy) screen device
 */
export class NoopScreenDevice extends ScreenDeviceType implements IScreenDevice {
    readonly hostVm: ISpectrumVm;

    constructor(spectrum?: ISpectrumVm) {
        super();
        this.hostVm = spectrum ? spectrum : new NoopSpectrumVm();
    }

    reset(): void {}
    getDeviceState(): any {}
    restoreDeviceState(state: any): void {}
    onAttachedToVm(hostVm: ISpectrumVm): void {}
    readonly frameCount = 0;
    overflow = 0;
    onNewFrame(): void {}
    onFrameCompleted(): void {}
    readonly frameCompleted: LiteEvent<void> = new LiteEvent<void>();
    readonly screenConfiguration = new ScreenConfiguration(new ScreenConfigurationData());
    readonly renderingTactTable = [];
    readonly refreshRate = 0;
    readonly flashToggleFrames = 0;
    borderColor = 0;
    renderScreen(fromTact: number, toTact: number): void {}
    getContentionValue(tact: number): number { return 0; }
    getPixelBuffer(): Uint8Array { return new Uint8Array(0); }
}