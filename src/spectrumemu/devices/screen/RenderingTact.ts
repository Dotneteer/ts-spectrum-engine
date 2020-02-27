import { ScreenRenderingPhase } from "./ScreenRenderingPhase";

    /// <summary>
    /// This structure defines information related to a particular tact
    /// of ULA screen rendering
    /// </summary>
export class RenderingTact {
    /**
     * The rendering phase to be applied for the particular tact
     */
    phase: ScreenRenderingPhase = 0;

    /**
     * Display memory contention delay
     */
    contentionDelay: number = 0;

    /**
     * Display memory address used in the particular tact
     */
    pixelByteToFetchAddress: number = 0;

    /**
     * Display memory address used in the particular tact
     */
    attributeToFetchAddress: number = 0;

    /**
     * Pixel index in the buffer
     */
    pixelIndex: number = 0;
}