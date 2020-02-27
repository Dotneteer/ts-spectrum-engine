import { IScreenConfigurationEx } from "../../abstraction/IScreenConfigurationEx";
import { IScreenConfiguration } from "../../abstraction/IScreenConfiguration";

/**
 * This class represents the parameters the ULA chip uses to render the Spectrum
 * screen.
 */
export class ScreenConfiguration implements IScreenConfigurationEx {
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

    /// <summary>
    /// Initializes a new instance of the <see cref="T:System.Object" /> class.
    /// </summary>
    constructor(configData: IScreenConfiguration) {
        this.interruptTact = configData.interruptTact;
        this.verticalSyncLines = configData.verticalSyncLines;
        this.nonVisibleBorderTopLines = configData.nonVisibleBorderTopLines;
        this.borderTopLines = configData.borderTopLines;
        this.borderBottomLines = configData.borderBottomLines;
        this.nonVisibleBorderBottomLines = configData.nonVisibleBorderBottomLines;
        this.displayLines = configData.displayLines;
        this.borderLeftTime = configData.borderLeftTime;
        this.borderRightTime = configData.borderRightTime;
        this.displayLineTime = configData.displayLineTime;
        this.horizontalBlankingTime = configData.horizontalBlankingTime;
        this.nonVisibleBorderRightTime = configData.nonVisibleBorderRightTime;
        this.pixelDataPrefetchTime = configData.pixelDataPrefetchTime;
        this.attributeDataPrefetchTime = configData.attributeDataPrefetchTime;

        // --- Calculated configuration values
        this.screenLines = this.borderTopLines + this.displayLines + this.borderBottomLines;
        this.firstDisplayLine = this.verticalSyncLines + this.nonVisibleBorderTopLines 
            + this.borderTopLines;
        this.lastDisplayLine = this.firstDisplayLine + this.displayLines - 1;
        this.borderLeftPixels = 2 * this.borderLeftTime;
        this.borderRightPixels = 2 * this.borderRightTime;
        this.displayWidth = 2 * this.displayLineTime;
        this.screenWidth = this.borderLeftPixels + this.displayWidth + this.borderRightPixels;
        this.screenLineTime = this.borderLeftTime + this.displayLineTime + this.borderRightTime 
            + this.nonVisibleBorderRightTime + this.horizontalBlankingTime;
        this.rasterLines = this.firstDisplayLine + this.displayLines 
            + this.borderBottomLines + this.nonVisibleBorderBottomLines;
        this.screenRenderingFrameTactCount = this.rasterLines * this.screenLineTime;
        this.firstDisplayPixelTact = this.firstDisplayLine * this.screenLineTime
            + this.borderLeftTime;
        this.firstScreenPixelTact = (this.verticalSyncLines + this.nonVisibleBorderTopLines) 
            * this.screenLineTime;
    }

    /// <summary>
    /// Tests whether the specified tact is in the visible area of the screen.
    /// </summary>
    /// <param name="line">Line index</param>
    /// <param name="tactInLine">Tacts index within the line</param>
    /// <returns>
    /// True, if the tact is visible on the screen; otherwise, false
    /// </returns>
    public isTactVisible(line: number, tactInLine: number): boolean {
        const firstVisibleLine = this.verticalSyncLines + this.nonVisibleBorderTopLines;
        const lastVisibleLine = firstVisibleLine + this.borderTopLines + this.displayLines + this.borderBottomLines;
        return line >= firstVisibleLine
            && line < lastVisibleLine
            && tactInLine >= 0
            && tactInLine < this.screenLineTime - this.nonVisibleBorderRightTime - this.horizontalBlankingTime;
    }

    /// <summary>
    /// Tests whether the tact is in the display area of the screen.
    /// </summary>
    /// <param name="line">Line index</param>
    /// <param name="tactInLine">Tacts index within the line</param>
    /// <returns>
    /// True, if the tact is within the display area of the screen; otherwise, false.
    /// </returns>
    public isTactInDisplayArea(line: number, tactInLine: number): boolean {
        return line >= this.firstDisplayLine 
            && line <= this.lastDisplayLine
            && tactInLine >= this.borderLeftTime
            && tactInLine < this.borderLeftTime + this.displayLineTime;
    }
}