import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";

/**
 * This interface represents the ROM device
 */
 export interface IRomDevice extends ISpectrumBoundDevice {
    /**
     * Gets the binary contents of the ROM
     * @param romIndex Index of the ROM, by default, 0
     * @return Byte array that represents the ROM bytes
     */
    getRomBytes(romIndex: number): Uint8Array;

    /**
     * Gets a known address of a particular ROM
     * @param key Known address key
     * @param romIndex Index of the ROM, by default, 0
     * @returns Address, if found; otherwise, null
     */
    getKnownAddress(key: string, romIndex: number): number | undefined;

    /**
     * Gets a property of the ROM (depends on virtual machine model)
     * @param key Property key
     * @param romIndex Property value if found
     * @return Property value if found
     */
    getProperty<TProp>(key: string, romIndex: number): { found: boolean, value: TProp | undefined; };
}