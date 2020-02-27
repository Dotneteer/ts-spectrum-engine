import { IVmComponentProvider } from "./IVmComponentProvider";

/**
 * This interface represents a renderer that can display a
 * pixel in a virtual screen device
 */
export interface IScreenFrameProvider extends IVmComponentProvider {
    /**
     * The ULA signs that it's time to start a new frame
     */
    startNewFrame(): void;

    /**
     * Signs that the current frame is rendered and ready to be displayed
     * @param frame The buffer that contains the frame to display
     */
    displayFrame(frame: Uint8Array): void;
}
