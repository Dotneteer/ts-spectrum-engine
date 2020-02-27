import { PortHandlerBase } from "./PortHandlerBase";
import { ISoundDevice } from "../../abstraction/ISoundDevice";
import { IPortDevice } from "../../abstraction/IPortDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";

const PORTMASK = 0b1100_0000_0000_0010;
const PORT = 0b1100_0000_0000_0000;

/**
 * This class represents the register index handler port 
 * of the AY-3-8912 PSG chip
 */
export class SoundRegisterIndexPortHandler extends PortHandlerBase {
    private _soundDevice: ISoundDevice | undefined;

    /**
     * Initializes a new port handler with the specified attributes.
     * @param parent Parent device
     */
    constructor(parent: IPortDevice) {
        super(parent, PORTMASK, PORT, false);
    }

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        super.onAttachedToVm(hostVm);
        this._soundDevice = hostVm.soundDevice;
    }

    /**
     * Writes the specified value to the port
     * @param addr Full port address
     * @param writeValue Value to write to the port
     */
    handleWrite(addr: number, writeValue: number): void {
        if (this._soundDevice) {
            this._soundDevice.setRegisterIndex(writeValue);
        }
    }
}
