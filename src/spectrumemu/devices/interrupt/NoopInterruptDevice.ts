import { InterruptDeviceType } from "./InterruptDeviceType";
import { IInterruptDevice } from "../../abstraction/IInterruptDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { LiteEvent } from "../../utils/LiteEvent";

/**
 * Non-operating (dummy) beeper device
 */
export class NoopInterruptDevice extends InterruptDeviceType implements IInterruptDevice {
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
    readonly interruptTact = 0;
    readonly interruptRaised = false;
    readonly interruptRevoked = false;
    checkForInterrupt(currentTact: number): void {}
}