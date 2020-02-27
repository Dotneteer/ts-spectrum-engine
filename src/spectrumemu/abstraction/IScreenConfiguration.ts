import { IDeviceConfiguration } from "./IDeviceConfiguration";

/**
 * This interface defines the data that can be used to render 
 * a Spectrum model's screen
 */
export interface IScreenConfiguration extends IDeviceConfiguration {
    /**
     * The tact index of the interrupt relative to the top-left
     * screen pixel
     */
    readonly interruptTact: number;
        
    /**
     * Number of lines used for vertical synch
     */
    readonly verticalSyncLines: number;

    /**
     * The number of top border lines that are not visible
     * when rendering the screen
     */
    readonly nonVisibleBorderTopLines: number;

    /**
     * The number of border lines before the display
     */
    readonly borderTopLines: number;

    /**
     * Number of display lines
     */
    readonly displayLines: number;

    /**
     * The number of border lines after the display
     */
    readonly borderBottomLines: number;

    /**
     * The number of bottom border lines that are not visible
     * when rendering the screen
     */
    readonly nonVisibleBorderBottomLines: number;

    /**
     * Horizontal blanking time (HSync+blanking).
     * Given in Z80 clock cycles.
     */
    readonly horizontalBlankingTime: number;

    /**
     * The time of displaying left part of the border.
     * Given in Z80 clock cycles.
     */
    readonly borderLeftTime: number;

    /**
     * The time of displaying a pixel row.
     * Given in Z80 clock cycles.
     */
    readonly displayLineTime: number;

    /**
     * The time of displaying right part of the border.
     * Given in Z80 clock cycles.
     */
    readonly borderRightTime: number;

    /**
     * The time used to render the nonvisible right part of the border.
     * Given in Z80 clock cycles.
     */
    readonly nonVisibleBorderRightTime: number;

    /**
     * The time the data of a particular pixel should be prefetched
     * before displaying it.
     * Given in Z80 clock cycles.
     */
    readonly pixelDataPrefetchTime: number;

    /**
     * The time the data of a particular pixel attribute should be prefetched
     * before displaying it.
     * Given in Z80 clock cycles.
     */
    readonly attributeDataPrefetchTime: number;
}