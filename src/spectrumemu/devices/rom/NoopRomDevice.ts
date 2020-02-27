import { RomDeviceType } from "./RomDeviceType";
import { IRomDevice } from "../../abstraction/IRomDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";

/**
 * Non-operating (dummy) ROM device
 */
export class NoopRomDevice extends RomDeviceType implements IRomDevice {
    readonly hostVm: ISpectrumVm;

    constructor(spectrum?: ISpectrumVm) {
        super();
        this.hostVm = spectrum ? spectrum : new NoopSpectrumVm();
    }

    reset(): void {}
    getDeviceState(): any {}
    restoreDeviceState(state: any): void {}
    onAttachedToVm(hostVm: ISpectrumVm): void {}
    getRomBytes(romIndex: number): Uint8Array { return new Uint8Array(0); }
    getKnownAddress(key: string, romIndex: number): number | undefined { return undefined; }
    getProperty<TProp>(key: string, romIndex: number): { found: boolean, value: TProp | undefined } {
        return { found: false, value: undefined }; 
    }
}