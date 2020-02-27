import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";
import { IFrameBoundDevice } from "./IFrameBoundDevice";
import { ScreenConfiguration } from "../devices/screen/ScreenConfiguration";
import { RenderingTact } from "../devices/screen/RenderingTact";

/**
 * This interface represents the device that renders the screen
 */
export interface IScreenDevice extends ISpectrumBoundDevice, IFrameBoundDevice {
    /**
     * Gets the parameters of the display
     */
    readonly screenConfiguration: ScreenConfiguration;

    /**
     * Table of ULA tact action information entries
     */
    readonly renderingTactTable: RenderingTact[];

    /**
     * Indicates the refresh rate calculated from the base clock frequency
     * of the CPU and the screen configuration (total #of ULA tacts per frame)
     */
    readonly refreshRate: number;

    /**
     * The number of frames when the flash flag should be toggles
     */
    readonly flashToggleFrames: number;

    /**
     * Gets or sets the current border color
     */
    borderColor: number;

    /**
     * Executes the ULA rendering actions between the specified tacts
     * @param fromTact First ULA tact
     * @param toTact Last ULA tact
     */
    renderScreen(fromTact: number, toTact: number): void;

    /**
     * Gets the memory contention value for the specified tact
     * @param tact ULA tact
     * @returns: The contention value for the ULA tact
     */
    getContentionValue(tact: number): number;

    /**
     * Gets the buffer that holds the screen pixels
     */
    getPixelBuffer(): Uint8Array;
}