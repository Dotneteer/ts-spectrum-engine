import { IRomProvider } from "../../abstraction/IRomProvider";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { zxSpectum48Rom, zxSpectrum48DisAnn } from "./ZxSpectrum48Rom";

export class SpectrumRomProvider implements IRomProvider {
    /**
     * The component provider should be able to reset itself
     */
    reset(): void {
    }

    /**
     * The virtual machine that hosts the provider
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * Signs that the provider has been attached to the Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
    }

    /**
     * Loads the binary contents of the ROM.
     * @param romName Name of the ROM
     * @param page Page of the ROM (-1 means single ROM page)
     * @return Binary contents of the ROM
     */
    loadRomBytes(romName: string, page: number): Uint8Array {
      return new Uint8Array(zxSpectum48Rom);
    }

    /**
     * Loads the binary contents of the ROM.
     * @param romName Name of the ROM
     * @param page Page of the ROM (-1 means single ROM page)
     * @return Annotations of the ROM in serialized format
     */
    loadRomAnnotations(romName: string, page: number): string {
      return JSON.stringify(zxSpectrum48DisAnn);
    }
}