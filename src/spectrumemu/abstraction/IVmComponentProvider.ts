import { ISpectrumVm } from "./ISpectrumVm";

/**
 * This interface defines the abstraction of a component provider
 * that can inject components into the ZX Spectrum virtual machine
 */
export interface IVmComponentProvider {
    /**
     * The component provider should be able to reset itself
     */
    reset(): void;

    /**
     * The virtual machine that hosts the provider
     */
    readonly hostVm: ISpectrumVm;

    /**
     * Signs that the provider has been attached to the Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void;
}
