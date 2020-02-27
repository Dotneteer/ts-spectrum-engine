import { IKeyboardProvider } from "../../abstraction/IKeyboardProvider";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { SpectrumKeyCode } from "./SpectrumKeyCode";
import { EmulatedKeyStroke } from "./EmulatedKeyStroke";
import { IKeyEventInfo } from "./IKeyEventInfo";
import { IKeyboardDevice } from "../../abstraction/IKeyboardDevice";

/**
 * Non-operating (dummy) keyboard provider
 */
export class NoopKeyboardProvider implements IKeyboardProvider {
    readonly hostVm: ISpectrumVm;

    constructor(spectrum?: ISpectrumVm) {
        this.hostVm = spectrum ? spectrum : new NoopSpectrumVm();
    }

    reset(): void {}
    onAttachedToVm(hostVm: ISpectrumVm): void {}
    setKeyStatusHandler(statusHandler: (device: IKeyboardDevice, key: SpectrumKeyCode, status: boolean) => void): void {}
    allowPhysicalKeys = false;
    keydown(keyInfo: IKeyEventInfo): void {}
    keyup(keyInfo: IKeyEventInfo): void {}
    emulateKeyStroke(): boolean { return false; }
    queueKeyPress(keypress: EmulatedKeyStroke): void {}
    setMappings(): void {}
}