import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";

/**
 * This interface represents a port device that can be attached to a 
 * Spectrum virtual machine
 */
export interface IPortDevice extends ISpectrumBoundDevice {
    /**
     * Reads the port with the specified address
     * @param addr Port address
     * @returns Port value
     */
    readPort(addr: number): number;
    
    /**
     * Sends a byte to the port with the specified address
     * @param addr Port address
     * @param data Data to write to the port
     */
    writePort(addr: number, data: number): void;

    /**
     * Emulates I/O contention
     * @param addr Port address
     */
    contentionWait(addr: number): void;
}
