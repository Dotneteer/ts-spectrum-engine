import { IRomProvider } from "../../abstraction/IRomProvider";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";

/**
 * Non-operating (dummy) ROM provider
 */
export class NoopRomProvider implements IRomProvider {
    readonly hostVm: ISpectrumVm;

    constructor(spectrum?: ISpectrumVm) {
        this.hostVm = spectrum ? spectrum : new NoopSpectrumVm();
    }

    reset(): void {}
    onAttachedToVm(hostVm: ISpectrumVm): void {}
    loadRomBytes(romName: string, page: number): Uint8Array { return new Uint8Array(0); }
    loadRomAnnotations(romName: string, page: number): string  { return ""; }
}