import { PortDeviceType } from "./PortDeviceType";
import { IPortDevice } from "../../abstraction/IPortDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";

/**
 * Non-operating (dummy) port device
 */
export class NoopPortDevice extends PortDeviceType implements IPortDevice {
    readonly hostVm: ISpectrumVm;

    constructor(spectrum?: ISpectrumVm) {
        super();
        this.hostVm = spectrum ? spectrum : new NoopSpectrumVm();
    }

    reset(): void {}
    getDeviceState(): any {}
    restoreDeviceState(state: any): void {}
    onAttachedToVm(hostVm: ISpectrumVm): void {}
    readPort(addr: number): number { return 0; }
    writePort(addr: number, data: number): void {}
    contentionWait(addr: number): void {}
}