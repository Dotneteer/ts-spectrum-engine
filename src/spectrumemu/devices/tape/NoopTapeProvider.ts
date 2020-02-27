import { ITapeProvider } from "../../abstraction/ITapeProvider";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { BinaryReader } from "../../utils/BinaryReader";
import { ITapeDataSerialization } from "./ITapeDataSerialization";

/**
 * Non-operating (dummy) tape provider
 */
export class NoopTapeProvider implements ITapeProvider {
    readonly hostVm: ISpectrumVm;

    constructor(spectrum?: ISpectrumVm) {
        this.hostVm = spectrum ? spectrum : new NoopSpectrumVm();
    }

    reset(): void {}
    onAttachedToVm(hostVm: ISpectrumVm): void {}
    getTapeContent(): BinaryReader { return new BinaryReader(new Buffer("")); }
    createTapeFile(): void {}
    setName(name: string): void {}
    saveTapeBlock(block: ITapeDataSerialization): void {}
    finalizeTapeFile(): void {}
}