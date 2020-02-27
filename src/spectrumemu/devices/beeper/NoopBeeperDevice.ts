import { BeeperDeviceType } from "./BeeperDeviceType";
import { IBeeperDevice } from "../../abstraction/IBeeperDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { LiteEvent } from "../../utils/LiteEvent";

/**
 * Non-operating (dummy) beeper device
 */
export class NoopBeeperDevice extends BeeperDeviceType implements IBeeperDevice {
    readonly hostVm: ISpectrumVm;

    constructor(spectrum?: ISpectrumVm) {
        super();
        this.hostVm = spectrum ? spectrum : new NoopSpectrumVm();
    }

    reset(): void {}
    sampleRate = 0;
    overrideSampleRate(sampleRate: number): void {}
    getDeviceState(): any {}
    restoreDeviceState(state: any): void {}
    onAttachedToVm(hostVm: ISpectrumVm): void {}
    readonly frameCount = 0;
    overflow = 0;
    onNewFrame(): void {}
    onFrameCompleted(): void {}
    readonly frameCompleted: LiteEvent<void> = new LiteEvent<void>();
    readonly audioSamples = [];
    readonly samplesPerFrame = 0;
    readonly tactsPerSample = 0;
    readonly nextSampleIndex = 0;
    readonly lastEarBit = false;
    readonly lastSampleTact = 0;
    processEarBitValue(fromTape: boolean, earBit: boolean): void {}
    setTapeOverride(useTape: boolean): void {}
}