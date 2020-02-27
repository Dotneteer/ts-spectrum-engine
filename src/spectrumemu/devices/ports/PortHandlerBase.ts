import { IPortHandler } from "../../abstraction/IPortHandler";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { IPortDevice } from "../../abstraction/IPortDevice";

    /// <summary>
    /// This class is intended to be the base class of all port handlers
    /// </summary>
export abstract class PortHandlerBase implements IPortHandler {
    /**
     * The host virtual machine
     */
    hostVm: ISpectrumVm | undefined;

    /**
     * Resets the port handler to it initial state
     */
    reset(): void {
    }

    /**
     * Gets the parent device of this port handler
     */
    readonly parentDevice: IPortDevice;

    /**
     * Initializes a new port handler with the specified attributes.
     * @param parent Parent device
     * @param mask Port mask
     * @param port Port number after masking
     * @param canRead Read supported?
     * @param canWrite Write supported?
     */
    protected constructor(parent: IPortDevice, mask: number, port: number, 
        canRead = true, canWrite = true) {
        this.parentDevice = parent;
        this.portMask = mask;
        this.port = port;
        this.canRead = canRead;
        this.canWrite = canWrite;
    }

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
    }

    /**
     * Mask for partial port decoding
     */
    readonly portMask: number;

    /**
     * Port address after masking
     */
    readonly port: number;

    /**
     * Can handle input operations?
     */
    readonly canRead: boolean;

    /**
     * Can handle output operations?
     */
    readonly canWrite: boolean;

    /**
     * Handles the read from the port
     * @param addr Full port address
     * @returns handled: True, if read handled; otherwise, false. readValue: The value read from the port
     */
    handleRead(addr: number): { handled: boolean, readValue: number } {
        return { handled: false, readValue: 0xFF };
    }

    /**
     * Writes the specified value to the port
     * @param addr Full port address
     * @param writeValue Value to write to the port
     */
    handleWrite(addr: number, writeValue: number): void {
    }
}