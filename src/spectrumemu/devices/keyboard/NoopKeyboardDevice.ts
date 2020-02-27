import { KeyboardDeviceType } from "./KeyboardDeviceType";
import { IKeyboardDevice } from "../../abstraction/IKeyboardDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { SpectrumKeyCode } from "./SpectrumKeyCode";
import { LiteEvent } from "../../utils/LiteEvent";

/**
 * Non-operating (dummy) keyboard device
 */
export class NoopKeyboardDevice extends KeyboardDeviceType implements IKeyboardDevice {
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
    setStatus(key: SpectrumKeyCode, isDown: boolean): void {}
    getStatus(key: SpectrumKeyCode): boolean { return false; }
    getLineStatus(lines: number): number { return 0xFF; }
}