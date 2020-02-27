import { IScreenConfiguration } from "./IScreenConfiguration";

/**
 * Extends the screen configuration with calculated values
 */
export interface IScreenConfigurationEx extends IScreenConfiguration {
    /**
     * The total number of lines in the screen
     */
    readonly screenLines: number;

    /**
     * The first screen line that contains the top left display pixel
     */
    readonly firstDisplayLine: number;

    /**
     * The last screen line that contains the bottom right display pixel
     */
    readonly lastDisplayLine: number;

    /**
     * The number of border pixels to the left of the display
     */
    readonly borderLeftPixels: number;

    /**
     * The number of displayed pixels in a display row
     */
    readonly displayWidth: number;

    /**
     * The number of border pixels to the right of the display
     */
    readonly borderRightPixels: number;

    /**
     * The total width of the screen in pixels
     */
    readonly screenWidth: number;

    /**
     * The time of displaying a full screen line.
     * Given in Z80 clock cycles.
     */
    readonly screenLineTime: number;

    /**
     * The tact in which the top left pixel should be displayed.
     * Given in Z80 clock cycles.
     */
    readonly firstDisplayPixelTact: number;

    /**
     * The tact in which the top left screen pixel (border) should be displayed
     */
    readonly firstScreenPixelTact: number;

    /**
     * The number of raster lines in the screen
     */
    readonly rasterLines: number;

    /**
     * Defines the number of Z80 clock cycles used for the full rendering
     * of the screen.
     */
    readonly screenRenderingFrameTactCount: number;
}