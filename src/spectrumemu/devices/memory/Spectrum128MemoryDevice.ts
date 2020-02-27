import { BankedMemoryDeviceBase } from "./BankedMemoryDeviceBase";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";

/**
 * This device represents the Spectrum 128 memory device
 */
export class Spectrum128MemoryDevice extends BankedMemoryDeviceBase {
    private _currentSlot3Bank = 0;

    /**
     * Initializes the device
     */
    constructor() {
        super(2, 8);
    }

    /**
     * Resets this device by filling the memory with 0xFF
     */
    reset(): void {
        super.reset();
        this._currentSlot3Bank = 0;
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
     * @param hostVm Host virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        super.onAttachedToVm(hostVm);
        this._currentSlot3Bank = 0;
    }

    /**
     * Reads the memory at the specified address
     * @param addr Memory address
     * @param supressContention Should memory contention suppressed?
     * @returns Memory contents
     */
    read(addr: number, supressContention?: boolean): number {
        const memIndex = addr & 0x3FFF;
        let memValue: number;
        switch (addr & 0xC000) {
            case 0x0000:
                return this._roms[this.selectedRomIndex][memIndex];
            
            case 0x4000:
                memValue = this.ramBanks[5][memIndex];
                if (supressContention || this.screenDevice === null) {
                    return memValue;
                }
                this.applyDelay();
                return memValue;
            
            case 0x8000:
                return this.ramBanks[2][memIndex];
            
            default:
                memValue = this.ramBanks[this._currentSlot3Bank][memIndex];
                if ((this._currentSlot3Bank & 0x01) === 0) {
                    return memValue;
                }
                
                // --- Bank 1, 3, 5, and 7 are contended
                this.applyDelay();
                return memValue;
        }
    }

    /**
     * Sets the memory value at the specified address
     * @param addr Memory address
     * @param value Value to write
     * @param supressContention Should memory contention suppressed?
     */
    write(addr: number, value: number, supressContention?: boolean): void {
        const memIndex = addr & 0x3FFF;
        switch (addr & 0xC000) {
            case 0x0000:
                // --- ROM cannot be overwritten
                return;
                
            case 0x4000:
                if (!supressContention) {
                    this.applyDelay();
                }
                this.ramBanks[5][memIndex] = value;
                break;
            
            case 0x8000:
                this.ramBanks[2][memIndex] = value;
                break;
            
            default:
                if ((this._currentSlot3Bank & 0x01) !== 0) {
                    // --- Bank 1, 3, 5, and 7 are contended
                    if (!supressContention) {
                        this.applyDelay();
                    }
                }
                this.ramBanks[this._currentSlot3Bank][memIndex] = value;
                break;
        }
    }

    /**
     * Pages in the selected bank into the specified slot
     * @param slot Slot index
     * @param bank Bank to page into the slot
     * @param bank16Mode Do we use 16K mode?
     */
    pageIn(slot: number, bank: number, bank16Mode?: boolean): void {
        if (slot !== 3) {
            return;
        }
        this._currentSlot3Bank = bank & 0x07;
    }

    /**
     * Gets the bank paged in to the specified slot
     * @param slot Slot index
     * @param bank16Mode Do we use 16K mode?
     * @returns Bank index of the specified slot
     */
    getSelectedBankIndex(slot: number, bank16Mode?: boolean): number {
        switch (slot & 0x03) {
            case 0: return 0;
            case 1: return 5;
            case 2: return 2;
            default: return this._currentSlot3Bank;
        }
    }

    /**
     * Gets the location of the address
     * @param addr Memory address
     * @returns Location of the memory address
     */
    getAddressLocation(addr: number): 
        { isInRom: boolean, index: number, address: number } {
        const bankAddr = addr & 0x3FFF;
        switch (addr & 0xC000) {
            case 0x0000:
                return { isInRom: true, index: this.selectedRomIndex, address: addr};
            case 0x4000:
                return { isInRom: false, index: 5, address: bankAddr};
            case 0x8000:
                return { isInRom: false, index: 2, address: bankAddr};
            default:
                return { isInRom: false, index: this._currentSlot3Bank, address: bankAddr};
        }
    }

    /**
     * Checks if the RAM bank with the specified index is paged in
     * @param index Bank index
     * @returns Location information
     */
    isRamBankPagedIn(index: number): 
        { isPagedIn: boolean; baseAddress: number } {
        if (index === 2) {
            return { isPagedIn: true, baseAddress: 0x8000 };
        }
        if (index === 5) {
            return { isPagedIn: true, baseAddress: 0x4000 };
        }
        if (index === this._currentSlot3Bank) {
            return { isPagedIn: true, baseAddress: 0xC000 };
        }
        return { isPagedIn: false, baseAddress: 0x0000 };
    }
}
