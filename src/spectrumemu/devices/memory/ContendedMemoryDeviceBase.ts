import { IMemoryDevice } from "../../abstraction/IMemoryDevice";
import { IZ80Cpu } from "../../abstraction/IZ80Cpu";
import { IScreenDevice } from "../../abstraction/IScreenDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { MemoryDeviceType } from "./MemoryDeviceType";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { NoopZ80Cpu } from "../../cpu/NoopZ80Cpu";

/// <summary>
    /// This class implements an abstract memory device that handles
    /// contention
    /// </summary>
export abstract class ContendedMemoryDeviceBase extends MemoryDeviceType implements IMemoryDevice {
    /**
     * The CPU device
     */
    protected cpu: IZ80Cpu = new NoopZ80Cpu();

    /**
     * The screen device
     */
    protected screenDevice: IScreenDevice | undefined;

    /**
     * Resets this device
     */
    abstract reset(): void;

    /**
     * Gets the current state of the device
     */
    abstract getDeviceState(): any;

    /**
     * Restores the state of the device from the specified object
     * @param state Device state
     */
    abstract restoreDeviceState(state: any): void;

    /**
     * The virtual machine that hosts the device
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostvm Host virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
            this.hostVm = hostVm;
            this.cpu = hostVm.cpu;
            this.screenDevice = hostVm ? hostVm.screenDevice: undefined;
        }

    /**
     * Reads the memory at the specified address
     * @param addr Memory address
     * @param supressContention Should memory contention suppressed?
     * @returns Memory contents
     */
    abstract read(addr: number, supressContention?: boolean): number;

    /**
     * Sets the memory value at the specified address
     * @param addr Memory address
     * @param value Value to write
     * @param supressContention Should memory contention suppressed?
     */
    abstract write(addr: number, value: number, supressContention?: boolean): void;

    /**
     * Emulates memory contention
     * @param addr Memory address
     */
    contentionWait(addr: number): void {
        if ((addr & 0xC000) === 0x4000) {
            this.applyDelay();
        }
    }

        /// <summary>
        /// Applies the delay according to the current frame tact
        /// </summary>
    protected applyDelay(): void {
        if (!this.screenDevice) {
            return;
        }
        const delay = this.screenDevice.getContentionValue(this.hostVm.currentFrameTact);
        this.cpu.delay(delay);
        this.hostVm.contentionAccumulated += delay;
    }

    /**
     * Gets the buffer that holds memory data
     */
    abstract cloneMemory(): Uint8Array;

    /**
     * Fills up the contents of the ROM pointed by 
     * SelectRom from the specified buffer
     * @param buffer Buffer to copy
     */
    abstract copyRom(buffer: Uint8Array): void;

    /**
     * Selects the ROM with the specified index
     * @param romIndex Index of the ROM to select
     */
    abstract selectRom(romIndex: number): void;

    /**
     * Retrieves the index of the selected ROM
     */
    abstract getSelectedRomIndex(): number;

    /**
     * Pages in the selected bank into the specified slot
     * @param slot Slot index
     * @param bank Bank to page into the slot
     * @param bank16Mode Do we use 16K mode?
     */
    abstract pageIn(slot: number, bank: number, bank16Mode?: boolean): void;

    /**
     * Gets the bank paged in to the specified slot
     * @param slot Slot index
     * @param bank16Mode Do we use 16K mode?
     * @returns Bank index of the specified slot
     */
    abstract getSelectedBankIndex(slot: number, bank16Mode?: boolean): number;

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
    abstract getRomBuffer(romIndex: number): Uint8Array;

    /**
     * Gets the data for the specfied RAM bank
     * @param bankIndex Bank index
     * @param bank16Mode Do we use 16K mode?
     */
    abstract getRamBank(bankIndex: number, bank16Mode?: boolean): Uint8Array;

    /**
     * Gets the location of the address
     * @param addr Memory address
     * @returns Location of the memory address
     */
    abstract getAddressLocation(addr: number): { isInRom: boolean, index: number, address: number }; 

    /**
     * Checks if the RAM bank with the specified index is paged in
     * @param index Bank index
     * @returns Location information
     */
    abstract isRamBankPagedIn(index: number): { isPagedIn: boolean; baseAddress: number };
}