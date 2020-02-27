import { IPortDevice } from "./IPortDevice";
import { ISpectrumVm } from "./ISpectrumVm";

/**
 * This interface represents an entity that can handle a fully or
 * partially decoded Spectrum port
 */
export interface IPortHandler {
    /**
     * Resets the port handler to it initial state
     */
    reset(): void;

    /**
     * Gets the parent device of this port handler
     */
    readonly parentDevice: IPortDevice;

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void;

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
    handleRead(addr: number): { handled: boolean, readValue: number };

    /**
     * Writes the specified value to the port
     * @param addr Full port address
     * @param writeValue Value to write to the port
     */
    handleWrite(addr: number, writeValue: number): void;
}