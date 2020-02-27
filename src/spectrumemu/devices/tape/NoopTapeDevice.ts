import { TapeDeviceType } from "./TapeDeviceType";
import { ITapeDevice } from "../../abstraction/ITapeDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { LiteEvent } from "../../utils/LiteEvent";

export class NoopTapeDevice extends TapeDeviceType implements ITapeDevice {
    readonly hostVm: ISpectrumVm;

    constructor(spectrum?: ISpectrumVm) {
        super();
        this.hostVm = spectrum ? spectrum : new NoopSpectrumVm();
    }

    reset(): void {}
    getDeviceState(): any {}
    restoreDeviceState(state: any): void {}
    onAttachedToVm(hostVm: ISpectrumVm): void {}
    readonly isInLoadMode = false;
    getEarBit(cpuTicks: number): boolean { return false; }
    setTapeMode(): void {}
    processMicBit(micBit: boolean): void {}
    loadCompleted: LiteEvent<void> = new LiteEvent<void>();
    enteredLoadMode: LiteEvent<void> = new LiteEvent<void>();
    leftLoadMode: LiteEvent<void> = new LiteEvent<void>();
    enteredSaveMode: LiteEvent<void> = new LiteEvent<void>();
    leftSaveMode: LiteEvent<void> = new LiteEvent<void>();
    onCpuOperationCompleted(): void {}
}