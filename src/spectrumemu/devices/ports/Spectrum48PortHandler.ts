import { PortHandlerBase } from "./PortHandlerBase";
import { IZ80Cpu } from "../../abstraction/IZ80Cpu";
import { IScreenDevice } from "../../abstraction/IScreenDevice";
import { IBeeperDevice } from "../../abstraction/IBeeperDevice";
import { IKeyboardDevice } from "../../abstraction/IKeyboardDevice";
import { ITapeDevice } from "../../abstraction/ITapeDevice";
import { IPortDevice } from "../../abstraction/IPortDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";

const PORTMASK = 0b0000_0000_0000_0001;
const PORT = 0b0000_0000_0000_0000;

/**
 * This class handles the standard spectrum port.
 */
export class Spectrum48PortHandler extends PortHandlerBase {
    private _cpu: IZ80Cpu | undefined;
    private _screenDevice: IScreenDevice | undefined;
    private _beeperDevice: IBeeperDevice | undefined;
    private _keyboardDevice: IKeyboardDevice | undefined ;
    private _tapeDevice: ITapeDevice | undefined;
    private _isUla3 = false;
    private _bit3LastValue = false;
    private _bit4LastValue = false;
    private _bit4ChangedFrom0 = 0;
    private _bit4ChangedFrom1 = 0;

    /**
     * Initializes a new port handler with the specified attributes.
     * @param parent Parent device
     */
    constructor(parent: IPortDevice) {
        super(parent, PORTMASK, PORT);
    }

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        super.onAttachedToVm(hostVm);
        this._isUla3 = hostVm.ulaIssue === "3";
        this._cpu = hostVm.cpu;
        this._screenDevice = hostVm.screenDevice;
        this._beeperDevice = hostVm.beeperDevice;
        this._keyboardDevice = hostVm.keyboardDevice;
        this._tapeDevice = hostVm.tapeDevice;
        this._bit3LastValue = true;
        this._bit4LastValue = true;
        this._bit4ChangedFrom0 = 0;
        this._bit4ChangedFrom1 = 0;
    }

    /**
     * Handles the read from the port
     * @param addr Full port address
     * @returns handled: True, if read handled; otherwise, false. readValue: The value read from the port
     */
    handleRead(addr: number): { handled: boolean, readValue: number } {
        let readValue = this._keyboardDevice 
            ? this._keyboardDevice.getLineStatus((addr >> 8) & 0xFF)
            : 0xFF;
        if (this._tapeDevice && this._tapeDevice.isInLoadMode) {
            const earBit = this._tapeDevice && this._cpu
                ?  this._tapeDevice.getEarBit(this._cpu.tacts)
                : true;
            if (!earBit) {
                readValue = (readValue & 0b1011_1111) & 0xFF;
            }
        } else {
            let bit4Sensed = this._bit4LastValue;
            if (!bit4Sensed) {
                let chargeTime = this._bit4ChangedFrom1 - this._bit4ChangedFrom0;
                if (chargeTime > 0) {
                    const delay = Math.min(chargeTime * 4, 2800);
                    bit4Sensed = (this._cpu ? this._cpu.tacts : 0) - this._bit4ChangedFrom1 < delay;
                }
            }
            var bit6Value = (this._bit3LastValue || bit4Sensed) ? 0b0100_0000 : 0x00;
            if (this._bit3LastValue && !bit4Sensed && this._isUla3) {
                bit6Value = 0x00;
            }
            readValue = ((readValue & 0b1011_1111) | bit6Value) & 0xFF;
        }
        return { handled: true, readValue: readValue};
    }

    /**
     * Writes the specified value to the port
     * @param addr Full port address
     * @param writeValue Value to write to the port
     */
    handleWrite(addr: number, writeValue: number): void {
        if (this._screenDevice) {
            this._screenDevice.borderColor = writeValue & 0x07;
        }
        if (this._beeperDevice) {
            this._beeperDevice.processEarBitValue(false, (writeValue & 0x10) !== 0);
        }
        if (this._tapeDevice) {
            this._tapeDevice.processMicBit((writeValue & 0x08) !== 0);
        }

        // --- Set the lates value of bit 3
        this._bit3LastValue = (writeValue & 0x08) !== 0;

        // --- Manage bit 4 value
        var curBit4 = (writeValue & 0x10) !== 0;
        if (!this._bit4LastValue && curBit4) {
            // --- Bit 4 goers from0 to 1
            this._bit4ChangedFrom0 = this._cpu ? this._cpu.tacts : 0;
            this._bit4LastValue = true;
        } else if (this._bit4LastValue && !curBit4) {
            this._bit4ChangedFrom1 = this._cpu ? this._cpu.tacts : 0;
            this._bit4LastValue = false;
        }
    }
}