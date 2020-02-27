import { MemoryDeviceType } from "./MemoryDeviceType";
import { IMemoryDevice } from "../../abstraction/IMemoryDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";

/**
 * Non-operating (dummy) memory device
 */
export class NoopMemoryDevice extends MemoryDeviceType implements IMemoryDevice {
    readonly hostVm: ISpectrumVm;

    constructor(spectrum?: ISpectrumVm) {
        super();
        this.hostVm = spectrum ? spectrum : new NoopSpectrumVm();
    }

    reset(): void {}
    getDeviceState(): any {}
    restoreDeviceState(state: any): void {}
    onAttachedToVm(hostVm: ISpectrumVm): void {}
    read(addr: number, supressContention?: boolean): number { return 0; }
    write(addr: number, value: number, supressContention?: boolean): void {}
    contentionWait(addr: number): void {}
    cloneMemory(): Uint8Array { return new Uint8Array(0); }
    copyRom(buffer: Uint8Array): void {}
    selectRom(romIndex: number): void {}
    getSelectedRomIndex(): number { return 0; }
    pageIn(slot: number, bank: number, bank16Mode?: boolean): void {}
    getSelectedBankIndex(slot: number, bank16Mode?: boolean): number { return 0; }
    usesShadowScreen = false;
    readonly isInAllRamMode = false;
    readonly isIn8KMode = false;
    getRomBuffer(romIndex: number): Uint8Array { return new Uint8Array(0); }
    getRamBank(bankIndex: number, bank16Mode?: boolean): Uint8Array { return new Uint8Array(0); }
    getAddressLocation(addr: number): { isInRom: boolean, index: number, address: number } {
        return { isInRom: false, index: 0, address: 0 };
    }
    isRamBankPagedIn(index: number): { isPagedIn: boolean, baseAddress: number } {
        return { isPagedIn: false, baseAddress: 0 };
    }
}