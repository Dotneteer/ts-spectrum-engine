import { ISpectrumDebugInfoProvider } from "../abstraction/ISpectrumDebugInfoProvider";
import { VmComponentProviderBase } from "../devices/VmComponentProviderBase";

/**
 * Default implementation of the Spectrum debug info provider
 */
export class SpectrumDebugInfoProvider extends VmComponentProviderBase implements ISpectrumDebugInfoProvider {
    private _breakpoints = new Set<number>();
    /**
     * The currently defined breakpoints
     */

    /**
     * Gets or sets an imminent breakpoint
     */
    imminentBreakpoint: number | undefined;

    /**
     * Use this method to prepare the breakpoints when running the
     * virtual machine in debug mode
     */
    prepareBreakpoints(): void {}

    /**
     * Checks if the virtual machine should stop at the specified address
     * @param address Address to check
     * True, if the address means a breakpoint to stop; otherwise, false
     */
    shouldBreakAtAddress(address: number): boolean {
        return this._breakpoints.has(address);
    }
}