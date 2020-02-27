import { IVmComponentProvider } from "./IVmComponentProvider";

/**
 * This interface defines the responsibility of a ROM provider
 */
export interface IRomProvider extends IVmComponentProvider {
    /**
     * Loads the binary contents of the ROM.
     * @param romName Name of the ROM
     * @param page Page of the ROM (-1 means single ROM page)
     * @return Binary contents of the ROM
     */
    loadRomBytes(romName: string, page: number): Uint8Array;

    /**
     * Loads the binary contents of the ROM.
     * @param romName Name of the ROM
     * @param page Page of the ROM (-1 means single ROM page)
     * @return Annotations of the ROM in serialized format
     */
    loadRomAnnotations(romName: string, page: number): string;
}