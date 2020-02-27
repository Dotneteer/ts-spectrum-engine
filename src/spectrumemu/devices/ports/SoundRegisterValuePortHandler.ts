import { PortHandlerBase } from "./PortHandlerBase";
import { IPortDevice } from "../../abstraction/IPortDevice";
import { ISoundDevice } from "../../abstraction/ISoundDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";

const PORTMASK = 0b1100_0000_0000_0010;
const PORT = 0b1000_0000_0000_0000;

/**
 * This class represents the register value handler port 
 * of the AY-3-8912 PSG chip
 */
export class SoundRegisterValuePortHandler extends PortHandlerBase {
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
     * Handles the read from the port
     * @param addr Full port address
     * @returns handled: True, if read handled; otherwise, false. readValue: The value read from the port
     */
    handleRead(addr: number): { handled: boolean, readValue: number } {
        if (this._soundDevice) {
            return { handled: true, readValue: this._soundDevice.getRegisterValue() };
        } else {
            return { handled: false, readValue: 0xFF };
        }
    }

    /**
     * Writes the specified value to the port
     * @param addr Full port address
     * @param writeValue Value to write to the port
     */
    handleWrite(addr: number, writeValue: number): void {
        if (this._soundDevice) {
            this._soundDevice.setRegisterValue(writeValue);
        }
    }
}
