import { ContendedMemoryDeviceBase } from "./ContendedMemoryDeviceBase";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";

/**
 * This device represents the Spectrum 128 memory device
 */
export abstract class BankedMemoryDeviceBase extends ContendedMemoryDeviceBase {
    private readonly _defaultRomCount: number;
    private readonly _defaultRamBankCount: number;
    protected _roms: Uint8Array[] = [];
    protected _ramBanks: Uint8Array[] = [];

    protected romCount = 0;
    protected ramBankCount = 0;
    protected selectedRomIndex = 0;

    /**
     * Initializes the device with the specified number of ROM and ROM banks
     * @param defaultRomCount ROM count
     * @param defaultRamBankCount RAM bank count
     */
    constructor(defaultRomCount = 2, defaultRamBankCount = 8) {
        super();
        this._defaultRomCount = defaultRomCount;
        this._defaultRamBankCount = defaultRamBankCount;
    }

    /**
     * Provides access to the ROM pages
     */
    get roms(): Uint8Array[] {
        return this._roms;
    }

    /**
     * Provides access to the RAM banks
     */
    get ramBanks(): Uint8Array[] { 
        return this._ramBanks;
    }

    /**
     * Provides access to the current ROM page
     */
    get currentRom(): Uint8Array{
        return this._roms[this.selectedRomIndex];
    } 

    /**
     * Resets this device by filling the memory with 0xFF
     */
    reset(): void {
        for (let i = 0; i < 0x4000; i++) {
            for (let j = 0; j < this.ramBankCount; j++) {
                this._ramBanks[j][i] = 0xFF;
            }
        }
        this.selectedRomIndex = 0;
    }

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        super.onAttachedToVm(hostVm);
        this.romCount = hostVm.romConfiguration && hostVm.romConfiguration.numberOfRoms
            ? hostVm.romConfiguration.numberOfRoms
            : this._defaultRomCount;
        this.ramBankCount = hostVm.memoryConfiguration && hostVm.memoryConfiguration.ramBanks
            ? hostVm.memoryConfiguration.ramBanks
            : this._defaultRamBankCount;

        // --- Create the ROM pages
        this._roms = [];
        for (let i = 0; i < this.romCount; i++) {
            this._roms[i] = new Uint8Array(0x4000);
        }

        // --- Create RAM pages
        this._ramBanks = [];
        for (let i = 0; i < this.ramBankCount; i++) {
            this._ramBanks[i] = new Uint8Array(0x4000);
        }

        this.selectedRomIndex = 0;
    }

    /**
     * Gets the buffer that holds memory data
     */
    cloneMemory(): Uint8Array {
        const clone = new Uint8Array(0x10000);
        for (let i = 0; i <= 3; i++) {
            const cloneAddr = i * 0x4000;
            const addrInfo = this.getAddressLocation(cloneAddr);
            if (addrInfo.isInRom) {
                for (let j = 0; j < 0x4000; j++) {
                    clone[cloneAddr + j] = this._roms[addrInfo.index][j];
                }
            } else {
                for (let j = 0; j < 0x4000; j++) {
                    clone[cloneAddr + j] = this._ramBanks[addrInfo.index][j];
                }
            }
        }
        return clone;
    }

    /**
     * Fills up the memory from the specified buffer
     * @param buffer Contains the row data to fill up the memory
     */
    copyRom(buffer: Uint8Array): void {
        for (let i = 0; i < 0x4000; i++) {
            this._roms[this.selectedRomIndex][i] = buffer[i];
        }
    }

    /**
     * Selects the ROM with the specified index
     * @param romIndex Index of the ROM
     */
    selectRom(romIndex: number): void {
        if (romIndex < 0) {
            romIndex = 0;
        }
        if (romIndex >= this.romCount) {
            romIndex = this.romCount - 1;
        }
        this.selectedRomIndex = romIndex;
    }

    /**
     * Retrieves the index of the selected ROM
     */
    getSelectedRomIndex(): number {
        return this.selectedRomIndex;
    }

    /**
     * Gets the data for the specfied ROM page
     * @param romIndex Index of the ROM
     */
    getRomBuffer(romIndex: number): Uint8Array {
        if (romIndex < 0) {
            romIndex = 0;
        }
        if (romIndex >= this.romCount) {
            romIndex = this.romCount - 1;
        }
        return this.roms[romIndex];
    }

    /**
     * Gets the data for the specfied RAM bank
     * @param bankIndex Bank index
     * @param bank16Mode Do we use 16K mode?
     */
    getRamBank(bankIndex: number, bank16Mode = true): Uint8Array {
        if (bankIndex < 0) {
            bankIndex = 0;
        }
        if (bankIndex >= this.ramBankCount) {
            bankIndex = this.ramBankCount - 1;
        }
        return this.ramBanks[bankIndex];
    }
}
