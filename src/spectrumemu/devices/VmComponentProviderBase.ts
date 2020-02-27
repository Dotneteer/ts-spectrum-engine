import { IVmComponentProvider } from "../abstraction/IVmComponentProvider";
import { ISpectrumVm } from "../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../machine/NoopSpectrumVm";

/**
 * This class implements a base class for providers
 */
export abstract class VmComponentProviderBase implements IVmComponentProvider {
    /**
     * The component provider should be able to reset itself
     */
    reset(): void { }

    /**
     * The virtual machine that hosts the provider
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * Signs that the provider has been attached to the Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
    }
}