import { IVmComponentProvider } from "./IVmComponentProvider";

/**
 * This interface defines the responsibilities of an object that provides
 * information about the current debugging mode.
 */
export interface ISpectrumDebugInfoProvider extends IVmComponentProvider {
    /**
     * Gets or sets an imminent breakpoint
     */
    imminentBreakpoint: number | undefined;

    /**
     * Use this method to prepare the breakpoints when running the
     * virtual machine in debug mode
     */
    prepareBreakpoints(): void;

    /**
     * Checks if the virtual machine should stop at the specified address
     * @param address Address to check
     * True, if the address means a breakpoint to stop; otherwise, false
     */
    shouldBreakAtAddress(address: number): boolean;
}