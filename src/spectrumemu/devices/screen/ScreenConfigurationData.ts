import { IScreenConfiguration } from "../../abstraction/IScreenConfiguration";

/**
 * This class can be used to describe a Spectrum model's screen data
 * for configuration
 */
export class ScreenConfigurationData implements IScreenConfiguration {
    /**
     * The tact index of the interrupt relative to the top-left
     * screen pixel
     */
    interruptTact: number = 0;
        
    /**
     * Number of lines used for vertical synch
     */
    verticalSyncLines: number = 0;

    /**
     * The number of top border lines that are not visible
     * when rendering the screen
     */
    nonVisibleBorderTopLines: number = 0;

    /**
     * The number of border lines before the display
     */
    borderTopLines: number = 0;

    /**
     * Number of display lines
     */
    displayLines: number = 0;

    /**
     * The number of border lines after the display
     */
    borderBottomLines: number = 0;

    /**
     * The number of bottom border lines that are not visible
     * when rendering the screen
     */
    nonVisibleBorderBottomLines: number = 0;

    /**
     * Horizontal blanking time (HSync+blanking).
     * Given in Z80 clock cycles.
     */
    horizontalBlankingTime: number = 0;

    /**
     * The time of displaying left part of the border.
     * Given in Z80 clock cycles.
     */
    borderLeftTime: number = 0;

    /**
     * The time of displaying a pixel row.
     * Given in Z80 clock cycles.
     */
    displayLineTime: number = 0;

    /**
     * The time of displaying right part of the border.
     * Given in Z80 clock cycles.
     */
    borderRightTime: number = 0;

    /**
     * The time used to render the nonvisible right part of the border.
     * Given in Z80 clock cycles.
     */
    nonVisibleBorderRightTime: number = 0;

    /**
     * The time the data of a particular pixel should be prefetched
     * before displaying it.
     * Given in Z80 clock cycles.
     */
    pixelDataPrefetchTime: number = 0;

    /**
     * The time the data of a particular pixel attribute should be prefetched
     * before displaying it.
     * Given in Z80 clock cycles.
     */
    attributeDataPrefetchTime: number = 0;

    /**
     * Returns a clone of this instance
     */
    Clone(): ScreenConfigurationData {
        const sc = new ScreenConfigurationData();
        sc.interruptTact = this.interruptTact;
        sc.borderLeftTime = this.borderLeftTime;
        sc.displayLineTime = this.displayLineTime;
        sc.borderRightTime = this.borderRightTime;
        sc.attributeDataPrefetchTime = this.attributeDataPrefetchTime;
        sc.borderBottomLines = this.borderBottomLines;
        sc.borderTopLines = this.borderTopLines;
        sc.displayLines = this.displayLines;
        sc.horizontalBlankingTime = this.horizontalBlankingTime;
        sc.nonVisibleBorderBottomLines = this.nonVisibleBorderBottomLines;
        sc.nonVisibleBorderRightTime = this.nonVisibleBorderRightTime;
        sc.nonVisibleBorderTopLines = this.nonVisibleBorderTopLines;
        sc.pixelDataPrefetchTime = this.pixelDataPrefetchTime;
        sc.verticalSyncLines = this.verticalSyncLines;
        return sc;
    }
}