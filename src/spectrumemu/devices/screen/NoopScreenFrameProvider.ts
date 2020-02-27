import { IScreenFrameProvider } from "../../abstraction/IScreenFrameProvider";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";

/**
 * Non-operating (dummy) screen frame provider
 */
export class NoopScreenFrameProvider implements IScreenFrameProvider {
    reset(): void {}
    readonly hostVm = new NoopSpectrumVm();
    onAttachedToVm(hostVm: ISpectrumVm): void {}
    startNewFrame(): void {}
    displayFrame(frame: Uint8Array): void {}
}