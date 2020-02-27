/**
 * This interface defines the operations that support 
 * the testing of a Spectrum virtual machine device.
 */
export interface ISpectrumVmTestSupport {
    /**
     * This flag tells if the frame has just been completed.
     */
    readonly hasFrameCompleted: boolean;

    /**
     * Writes a byte to the memory
     * @param addr Memory address
     * @param value Data byte
     */
    writeSpectrumMemory(addr: number, value: number): void;

    /**
     * Sets the ULA frame tact for testing purposes
     * @param tacts ULA frame tact to set
     */
    setUlaFrameTact(tacts: number): void;
}