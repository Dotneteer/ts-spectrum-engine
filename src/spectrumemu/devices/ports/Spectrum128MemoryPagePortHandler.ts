import { PortHandlerBase } from "./PortHandlerBase";
import { IMemoryDevice } from "../../abstraction/IMemoryDevice";
import { NoopMemoryDevice } from "../memory/NoopMemoryDevice";
import { IPortDevice } from "../../abstraction/IPortDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";

const PORTMASK = 0b1100_0000_0000_0010;
const PORT = 0b0100_0000_0000_0000;

/**
 * This class handles the memory paging port of Spectrum 128.
 */
export class Spectrum128MemoryPagePortHandler extends PortHandlerBase {
    private _memoryDevice: IMemoryDevice = new NoopMemoryDevice();
    /**
     * Initializes a new port handler with the specified attributes.
     * @param parent Parent device
     */
    constructor(parent: IPortDevice) {
        super(parent, PORTMASK, PORT, false);
    }

    /**
     * Indicates if paging is enabled or not.
     * Port 0x7FFD, Bit 5: 
     * False - paging is enables
     * True - paging is not enabled and further output to the port
     * is ignored until the computer is reset
     */
    pagingEnabled = true;

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        super.onAttachedToVm(hostVm);
        this._memoryDevice = hostVm.memoryDevice;
    }

    /**
     * Resets this device
     */
    reset(): void {
        super.reset();
        this.pagingEnabled = true;
    }

    /**
     * Writes the specified value to the port
     * @param addr Full port address
     * @param writeValue Value to write to the port
     */
    handleWrite(addr: number, writeValue: number): void {
        // --- When paging is disabled, it will be enabled next time
        // --- only after reset
        if (!this.pagingEnabled) {
            return;
        }

        // --- Choose the RAM bank for Slot 3 (0xc000-0xffff)
        this._memoryDevice.pageIn(3, writeValue & 0x07);

        // --- Choose screen (Bank 5 or 7)
        this._memoryDevice.usesShadowScreen = ((writeValue >> 3) & 0x01) === 0x01;

        // --- Choose ROM bank for Slot 0 (0x0000-0x3fff)
        this._memoryDevice.selectRom((writeValue >> 4) & 0x01);

        // --- Enable/disable paging
        this.pagingEnabled = (writeValue & 0x20) === 0x00;
    }
}
