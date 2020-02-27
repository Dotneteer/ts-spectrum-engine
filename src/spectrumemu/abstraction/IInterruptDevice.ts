import { IFrameBoundDevice } from "./IFrameBoundDevice";
import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";

/**
 * This device is used to generate maskable interrupts in every frame
 */
export interface IInterruptDevice extends IFrameBoundDevice, ISpectrumBoundDevice {
    /**
     * The ULA tact to raise the interrupt at
     */
    readonly interruptTact: number;

    /**
     * Signs that an interrupt has been raised in this frame.
     */
    readonly interruptRaised: boolean;

    /**
     * Signs that the interrupt signal has been revoked
     */
    readonly interruptRevoked: boolean;

    /**
     * Generates an interrupt in the current phase, if time has come.
     * @param currentTact Current frame tact
     */
    checkForInterrupt(currentTact: number): void;
}