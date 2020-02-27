import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";

/**
 * This interface represents the Spectrum's memory device
 */
export interface IMemoryDevice extends ISpectrumBoundDevice {
    /**
     * Reads the memory at the specified address
     * @param addr Memory address
     * @param supressContention Should memory contention suppressed?
     * @returns Memory contents
     */
    read(addr: number, supressContention?: boolean): number;

    /**
     * Sets the memory value at the specified address
     * @param addr Memory address
     * @param value Value to write
     * @param supressContention Should memory contention suppressed?
     */
    write(addr: number, value: number, supressContention?: boolean): void;

    /**
     * Emulates memory contention
     * @param addr Memory address
     */
    contentionWait(addr: number): void;

    /**
     * Gets the buffer that holds memory data
     */
    cloneMemory(): Uint8Array;

    /**
     * Fills up the contents of the ROM pointed by 
     * SelectRom from the specified buffer
     * @param buffer Buffer to copy
     */
    copyRom(buffer: Uint8Array): void;

    /**
     * Selects the ROM with the specified index
     * @param romIndex Index of the ROM to select
     */
    selectRom(romIndex: number): void;

    /**
     * Retrieves the index of the selected ROM
     */
    getSelectedRomIndex(): number;

    /**
     * Pages in the selected bank into the specified slot
     * @param slot Slot index
     * @param bank Bank to page into the slot
     * @param bank16Mode Do we use 16K mode?
     */
    pageIn(slot: number, bank: number, bank16Mode?: boolean): void;

    /**
     * Gets the bank paged in to the specified slot
     * @param slot Slot index
     * @param bank16Mode Do we use 16K mode?
     * @returns Bank index of the specified slot
     */
    getSelectedBankIndex(slot: number, bank16Mode?: boolean): number;

    /**
     * Indicates if shadow screen should be used
     */
    usesShadowScreen: boolean;

    /**
     * Indicates special mode: special RAM paging
     */
    readonly isInAllRamMode: boolean;

    /**
     * Indicates if the device is in 8K mode
     */
    readonly isIn8KMode: boolean;

    /**
     * Gets the data for the specfied ROM page
     * @param romIndex ROM index
     * @returns ROM contents 
     */
    getRomBuffer(romIndex: number): Uint8Array;

    /**
     * Gets the data for the specfied RAM bank
     * @param bankIndex Bank index
     * @param bank16Mode Do we use 16K mode?
     */
    getRamBank(bankIndex: number, bank16Mode?: boolean): Uint8Array;

    /**
     * Gets the location of the address
     * @param addr Memory address
     * @returns Location of the memory address
     */
    getAddressLocation(addr: number): { isInRom: boolean, index: number, address: number };

    /**
     * Checks if the RAM bank with the specified index is paged in
     * @param index Bank index
     * @returns Location information
     */
    isRamBankPagedIn(index: number): { isPagedIn: boolean, baseAddress: number };
}