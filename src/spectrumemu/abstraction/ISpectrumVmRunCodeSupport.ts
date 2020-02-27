/**
 * This interface defines the operations that support 
 * running injected Z80 code on the Spectrum virtual machine
 */
export interface ISpectrumVmRunCodeSupport {
    /**
     * Injects code into the memory
     * @param addr Start address
     * @param code Code to inject
     * The code leaves the ROM area untouched.
     */
    injectCodeToMemory(addr: number, code: Uint8Array): void;

    /**
     * Prepares the custom code for running, as if it were started
     * with the RUN command
     */
    prepareRunMode(): void;
}