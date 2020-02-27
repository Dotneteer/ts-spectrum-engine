import { ContendedMemoryDeviceBase } from "./ContendedMemoryDeviceBase";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";

/// <summary>
    /// This device represents the Spectrum 48 memory device
    /// </summary>
export class Spectrum48MemoryDevice extends ContendedMemoryDeviceBase {
    private _memory = new Uint8Array(0);

    /**
     * Resets the device
     */
    reset(): void {
        for (let i = 0; i < this._memory.length; i++) {
            this.write(i & 0xFFFF, 0xFF, true);
        }
    }

    /**
     * Gets the current state of the device
     */
    getDeviceState(): any {
        return undefined;
    }

    /**
     * Restores the state of the device from the specified object
     * @param state Device state
     */
    restoreDeviceState(state: any): void {
    }

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostvm Host virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        super.onAttachedToVm(hostVm);
        this._memory = new Uint8Array(0x10000);
        for (let i = 0; i < this._memory.length; i++) {
            this._memory[i] = 0x00;
        }
    }

    /**
     * Reads the memory at the specified address
     * @param addr Memory address
     * @param supressContention Should memory contention suppressed?
     * @returns Memory contents
     */
    read(addr: number, supressContention: boolean = false): number {
        const value = this._memory[addr] & 0xFF;
        if (supressContention) {
            return value;
        }

        this.contentionWait(addr);
        return value;
    }

    /**
     * Sets the memory value at the specified address
     * @param addr Memory address
     * @param value Value to write
     * @param supressContention Should memory contention suppressed?
     */
    write(addr: number, value: number, supressContention: boolean = false): void {
        switch (addr & 0xC000) {
            case 0x0000:
                // --- ROM cannot be overwritten
                return;
            case 0x4000:
                if (!supressContention) {
                    this.applyDelay();
                }
                break;
        }
        this._memory[addr] = value;
    }

    /**
     * Gets the buffer that holds memory data
     */
    cloneMemory(): Uint8Array {
        return new Uint8Array(this._memory);
    }

    /**
     * Fills up the contents of the ROM pointed by 
     * SelectRom from the specified buffer
     * @param buffer Buffer to copy
     */
    copyRom(buffer: Uint8Array): void {
        for (let i = 0; i < buffer.length; i++) {
            this._memory[i] = buffer[i];
        }
    }

    /**
     * Selects the ROM with the specified index
     * @param romIndex Index of the ROM to select
     */
    selectRom(romIndex: number): void {
            // --- Spectrum 48 does not support banks, we do nothing
    }

    /**
     * Retrieves the index of the selected ROM
     */
    getSelectedRomIndex(): number {
        return 0;
    }

    /**
     * Pages in the selected bank into the specified slot
     * @param slot Slot index
     * @param bank Bank to page into the slot
     * @param bank16Mode Do we use 16K mode?
     */
    pageIn(slot: number, bank: number, bank16Mode?: boolean): void {
            // --- Spectrum 48 does not support banks, we do nothing
    }

    /**
     * Gets the bank paged in to the specified slot
     * @param slot Slot index
     * @param bank16Mode Do we use 16K mode?
     * @returns Bank index of the specified slot
     */
    getSelectedBankIndex(slot: number, bank16Mode?: boolean): number {
        return 0;
    }

    /**
     * Indicates if shadow screen should be used
     */
    usesShadowScreen: boolean = false;

    /**
     * Indicates special mode: special RAM paging
     */
    get isInAllRamMode(): boolean {
        return false;
    }

    /**
     * Indicates if the device is in 8K mode
     */
    get isIn8KMode(): boolean {
        return false;
    }

    /**
     * Gets the data for the specfied ROM page
     * @param romIndex ROM index
     * @returns ROM contents 
     */
    getRomBuffer(romIndex: number): Uint8Array {
        const rom = new Uint8Array(0x4000);
        for (let i = 0; i < 0x4000; i++) {
            rom[i] = this._memory[i];
        }
        return rom;
    }

    /**
     * Gets the data for the specfied RAM bank
     * @param bankIndex Bank index
     * @param bank16Mode Do we use 16K mode?
     */
    getRamBank(bankIndex: number, bank16Mode?: boolean): Uint8Array {
        const ram = new Uint8Array(0x4000);
        for (let i = 0; i < 0xC000; i++) {
            ram[i] = this._memory[i + 0x4000];
        }
        return ram;
    }

    /**
     * Gets the location of the address
     * @param addr Memory address
     * @returns Location of the memory address
     */
    getAddressLocation(addr: number): { isInRom: boolean, index: number, address: number } {
            return addr < 0x4000
                ? { isInRom: true, index: 0, address: addr }
                : { isInRom: false, index: 0, address: (addr - 0x4000) & 0xFFFF };
        }

    /**
     * Checks if the RAM bank with the specified index is paged in
     * @param index Bank index
     * @returns Location information
     */
    isRamBankPagedIn(index: number): { isPagedIn: boolean, baseAddress: number } {
        return { isPagedIn: false, baseAddress: 0x4000 };
    }
}