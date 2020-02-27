import { ISoundDevice } from "../../abstraction/ISoundDevice";
import { SoundDeviceType } from "./SoundDeviceType";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { PsgState } from "./PsgState";
import { LiteEvent } from "../../utils/LiteEvent";

export class NoopSoundDevice extends SoundDeviceType implements ISoundDevice {
    readonly hostVm: ISpectrumVm;

    constructor(spectrum?: ISpectrumVm) {
        super();
        this.hostVm = spectrum ? spectrum : new NoopSpectrumVm();
        this.psgState = new PsgState(this.hostVm);
    }

    reset(): void {}
    sampleRate = 0;
    overrideSampleRate(sampleRate: number): void {}
    getDeviceState(): any {}
    restoreDeviceState(state: any): void {}
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.psgState = new PsgState(hostVm);
    }
    readonly frameCount = 0;
    overflow = 0;
    onNewFrame(): void {}
    onFrameCompleted(): void {}
    readonly frameCompleted: LiteEvent<void> = new LiteEvent<void>();
    lastSampleTact = 0;
    psgState: PsgState;
    lastRegisterIndex = 0;
    setRegisterIndex(index: number): void {}
    setRegisterValue(value: number): void {}
    getRegisterValue(): number { return 0; }
    readonly audioSamples = [];
    readonly nextSampleIndex = 0;
}