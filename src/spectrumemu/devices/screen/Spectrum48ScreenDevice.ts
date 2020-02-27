import { IScreenDevice } from "../../abstraction/IScreenDevice";
import { ScreenDeviceType } from "./ScreenDeviceType";
import { IScreenDeviceTestSupport } from "./IScreenDeviceTestSupport";
import { IScreenFrameProvider } from "../../abstraction/IScreenFrameProvider";
import { IMemoryDevice } from "../../abstraction/IMemoryDevice";
import { MemoryContentionType } from "../memory/MemoryContentionType";
import { RenderingTact } from "./RenderingTact";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { NoopScreenFrameProvider } from "./NoopScreenFrameProvider";
import { ScreenConfiguration } from "./ScreenConfiguration";
import { ScreenConfigurationData } from "./ScreenConfigurationData";
import { ScreenRenderingPhase } from "./ScreenRenderingPhase";
import { NoopMemoryDevice } from "../memory/NoopMemoryDevice";
import { DT_SCREEN } from "../DeviceTypes";
import { LiteEvent } from "../../utils/LiteEvent";

/**
 * The ARGB color set for Spectrum 48 pixel values
 */
export const SpectrumColors = [
    0xFF000000, // Black
    0xFFAA0000, // Blue
    0xFF0000AA, // Red
    0xFFAA00AA, // Magenta
    0xFF00AA00, // Green
    0xFFAAAA00, // Cyan
    0xFF00AAAA, // Yellow
    0xFFAAAAAA, // White
    0xFF000000, // Bright Black
    0xFFFF0000, // Bright Blue
    0xFF0000FF, // Bright Red
    0xFFFF00FF, // Bright Magenta
    0xFF00FF00, // Bright Green
    0xFFFFFF00, // Bright Cyan
    0xFF00FFFF, // Bright Yellow
    0xFFFFFFFF, // Bright White
];

/**
 * This class is responsible to render a single frame of the screen
 */
export class Spectrum48ScreenDevice extends ScreenDeviceType implements IScreenDevice, IScreenDeviceTestSupport {
    private _pixelBuffer = new Uint8Array(0);
    private _flashOffColors: number[] = [];
    private _flashOnColors: number[] = [];

    private _pixelRenderer: IScreenFrameProvider = new NoopScreenFrameProvider();
    private _memoryDevice: IMemoryDevice = new NoopMemoryDevice();
    private _contentionType = MemoryContentionType.None;

    private _flashPhase = false;

    // --- Pixel and attribute info stored while rendering the screen
    private _pixelByte1 = 0;
    private _pixelByte2 = 0;
    private _attrByte1 = 0;
    private _attrByte2 = 0;
    private _screenWidth = 0;

    private _frameCompleted = new LiteEvent<void>();

    /**
     * Gets or sets the current border color
     */
    borderColor = 0;

    /**
     * Table of screen rendering tact action information entries
     */
    renderingTactTable: RenderingTact[] = [];

    /**
     * Indicates the refresh rate calculated from the base clock frequency
     * of the CPU and the screen configuration (total #of screen rendering tacts per frame)
     */
    refreshRate = 0;

    /**
     * The number of frames when the flash flag should be toggled
     */
    flashToggleFrames = 0;

    /**
     * The virtual machine that hosts the device
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
        const screenInfo = hostVm.getDeviceInfo(DT_SCREEN);
        this.screenConfiguration = hostVm.screenConfiguration;
        if (screenInfo && screenInfo.provider) {
            this._pixelRenderer = screenInfo.provider as IScreenFrameProvider;
        }
        this._memoryDevice = hostVm.memoryDevice;
        this._contentionType = hostVm.memoryConfiguration.contentionType;
        this._screenWidth = hostVm.screenDevice.screenConfiguration.screenWidth;
        this._flashPhase = false;
        this.frameCount = 0;

        // --- Calculate refresh rate related values
        this.refreshRate = hostVm.baseClockFrequency / this.screenConfiguration.screenRenderingFrameTactCount;
        this.flashToggleFrames = Math.round(this.refreshRate/2);

        // --- Calculate color conversion table
        this._flashOffColors = [];
        this._flashOnColors = [];

        for (let attr = 0; attr < 0x100; attr++) {
            const ink = (attr & 0x07) | ((attr & 0x40) >> 3);
            const paper = ((attr & 0x38) >> 3) | ((attr & 0x40) >> 3);
            this._flashOffColors[attr] = paper;
            this._flashOffColors[0x100 + attr] = ink;
            this._flashOnColors[attr] = (attr & 0x80) !== 0 ? ink : paper;
            this._flashOnColors[0x100 + attr] = (attr & 0x80) !== 0 ? paper : ink;
        }

        this._pixelBuffer = new Uint8Array(this._screenWidth * hostVm.screenDevice.screenConfiguration.screenLines);
        this.initializeScreenRenderingTactTable();
    }

    /**
     * #of frames rendered
     */
    frameCount = 0;

    /**
     * Overflow from the previous frame, given in #of tacts 
     */
    overflow = 0;

    /**
     * Allow the device to react to the start of a new frame
     */
    onNewFrame(): void {
        this.frameCount++;
        if (this.frameCount % this.flashToggleFrames === 0) {
            this._flashPhase = !this._flashPhase;
        }
        this._pixelRenderer.startNewFrame();
        this.renderScreen(0, this.overflow);
    }

    /**
     * Allow the device to react to the completion of a frame
     */
    onFrameCompleted(): void {
        this._pixelRenderer.displayFrame(this._pixelBuffer);
        this._frameCompleted.trigger();
    }

    /**
     * Allow external entities respond to frame completion
     */
    get frameCompleted(): LiteEvent<void> {
        return this._frameCompleted;
    }

    /**
     * Gets the parameters of the display
     */
    screenConfiguration: ScreenConfiguration = new ScreenConfiguration(new ScreenConfigurationData());

    /**
     * Resets the device
     */
    reset(): void {
        this._flashPhase = false;
        this._pixelRenderer.reset();
        this.frameCount = 0;
    }

    /**
     * Gets the current state of the device
     */
    getDeviceState(): any {}

    /**
     * Restores the state of the device from the specified object
     * @param state Device state
     */
    restoreDeviceState(state: any): void {}

    /**
     * Executes the screen rendering actions between the specified tacts
     * @param fromTact First screen rendering tact
     * @param toTact Last screen rendering tact
     */
    renderScreen(fromTact: number, toTact: number): void {
            // --- Do not refresh the screen when in fast mode, or explicitly disabled
        if (this.hostVm.executeCycleOptions.disableScreenRendering
            || this.frameCount > 2 && this.hostVm.executeCycleOptions.fastVmMode
                && this.hostVm.executeCycleOptions.disableScreenRendering) {
            return;
        }

        // --- Adjust the tact boundaries
        fromTact = fromTact % this.screenConfiguration.screenRenderingFrameTactCount;
        toTact = toTact % this.screenConfiguration.screenRenderingFrameTactCount;
        const buffer = this._pixelBuffer;

        // --- Carry out each tact action according to the rendering phase
        for (let currentTact = fromTact; currentTact <= toTact; currentTact++) {
            const screenTact = this.renderingTactTable[currentTact];

            switch (screenTact.phase) {
                case ScreenRenderingPhase.None:
                    // --- Invisible screen area, nothing to do
                    break;

                case ScreenRenderingPhase.Border:
                    // --- Fetch the border color and set the corresponding border pixels
                    buffer[screenTact.pixelIndex] = this.borderColor;
                    buffer[screenTact.pixelIndex + 1] = this.borderColor;
            
                    break;

                case ScreenRenderingPhase.BorderFetchPixel:
                    // --- Fetch the border color and set the corresponding border pixels
                    buffer[screenTact.pixelIndex] = this.borderColor;
                    buffer[screenTact.pixelIndex + 1] = this.borderColor;
                    // --- Obtain the future pixel byte
                    this._pixelByte1 = this._memoryDevice.read(screenTact.pixelByteToFetchAddress, true);
                    break;

                case ScreenRenderingPhase.BorderFetchPixelAttr:
                    // --- Fetch the border color and set the corresponding border pixels
                    buffer[screenTact.pixelIndex] = this.borderColor;
                    buffer[screenTact.pixelIndex + 1] = this.borderColor;
                    // --- Obtain the future attribute byte
                    this._attrByte1 = this._memoryDevice.read(screenTact.attributeToFetchAddress, true);
                    break;

                case ScreenRenderingPhase.DisplayB1:
                    // --- Display bit 7 and 6 according to the corresponding color
                    buffer[screenTact.pixelIndex] = this._getColor(this._pixelByte1 & 0x80, this._attrByte1);
                    buffer[screenTact.pixelIndex + 1] = this._getColor(this._pixelByte1 & 0x40, this._attrByte1);
                    // --- Shift in the subsequent bits
                    this._pixelByte1 <<= 2;
                    break;

                case ScreenRenderingPhase.DisplayB1FetchB2:
                    // --- Display bit 7 and 6 according to the corresponding color
                    buffer[screenTact.pixelIndex] = this._getColor(this._pixelByte1 & 0x80, this._attrByte1);
                    buffer[screenTact.pixelIndex + 1] = this._getColor(this._pixelByte1 & 0x40, this._attrByte1);
                    // --- Shift in the subsequent bits
                    this._pixelByte1 <<= 2;
                    // --- Obtain the next pixel byte
                    this._pixelByte2 = this._memoryDevice.read(screenTact.pixelByteToFetchAddress, true);
                    break;

                case ScreenRenderingPhase.DisplayB1FetchA2:
                    // --- Display bit 7 and 6 according to the corresponding color
                    buffer[screenTact.pixelIndex] = this._getColor(this._pixelByte1 & 0x80, this._attrByte1);
                    buffer[screenTact.pixelIndex + 1] = this._getColor(this._pixelByte1 & 0x40, this._attrByte1);
                    // --- Shift in the subsequent bits
                    this._pixelByte1 <<= 2;
                    // --- Obtain the next attribute
                    this._attrByte2 = this._memoryDevice.read(screenTact.attributeToFetchAddress, true);
                    break;

                case ScreenRenderingPhase.DisplayB2:
                    // --- Display bit 7 and 6 according to the corresponding color
                    buffer[screenTact.pixelIndex] = this._getColor(this._pixelByte2 & 0x80, this._attrByte2);
                    buffer[screenTact.pixelIndex + 1] = this._getColor(this._pixelByte2 & 0x40, this._attrByte2);
                    // --- Shift in the subsequent bits
                    this._pixelByte2 <<= 2;
                    break;

                case ScreenRenderingPhase.DisplayB2FetchB1:
                    // --- Display bit 7 and 6 according to the corresponding color
                    buffer[screenTact.pixelIndex] = this._getColor(this._pixelByte2 & 0x80, this._attrByte2);
                    buffer[screenTact.pixelIndex + 1] = this._getColor(this._pixelByte2 & 0x40, this._attrByte2);
                    // --- Shift in the subsequent bits
                    this._pixelByte2 <<= 2;
                    // --- Obtain the next pixel byte
                    this._pixelByte1 = this._memoryDevice.read(screenTact.pixelByteToFetchAddress, true);
                    break;

                case ScreenRenderingPhase.DisplayB2FetchA1:
                    // --- Display bit 7 and 6 according to the corresponding color
                    buffer[screenTact.pixelIndex] = this._getColor(this._pixelByte2 & 0x80, this._attrByte2);
                    buffer[screenTact.pixelIndex + 1] = this._getColor(this._pixelByte2 & 0x40, this._attrByte2);
                    // --- Shift in the subsequent bits
                    this._pixelByte2 <<= 2;
                    // --- Obtain the next attribute
                    this._attrByte1 = this._memoryDevice.read(screenTact.attributeToFetchAddress, true);
                    break;
            }
        }
    }

    /**
     * Gets the memory contention value for the specified tact
     * @param tact ULA tact
     * @returns: The contention value for the ULA tact
     */
    getContentionValue(tact: number): number {
        return this.renderingTactTable[tact%this.screenConfiguration.screenRenderingFrameTactCount].contentionDelay;
    }

    /**
     * Gets the buffer that holds the screen pixels
     */
    getPixelBuffer(): Uint8Array {
            return this._pixelBuffer;
    }

    /**
     * Gets the color index for the specified pixel value according
     * to the given color attribute
     * @param pixelValue 0 for paper pixel, non-zero for ink pixel
     * @param attr Color attribute
     */
    private _getColor(pixelValue: number, attr: number): number {
        const offset = (pixelValue === 0 ? 0 : 0x100) + attr;
        return this._flashPhase
            ? this._flashOnColors[offset]
            : this._flashOffColors[offset];
    }

    /**
     * Initializes the screen rendering tacts table, which is the pivotal piece of
     * screen rendering
     */
    initializeScreenRenderingTactTable(): void {
        // --- Reset the tact information table
        this.renderingTactTable = [];

        // --- Iterate through tacts
        for (let tact = 0; tact < this.screenConfiguration.screenRenderingFrameTactCount; tact++) {
            // --- We can put a tact shift logic here in the future
            // ...

            // --- calculate screen line and tact in line values here
            const line = Math.floor(tact / this.screenConfiguration.screenLineTime);
            var tactInLine = tact % this.screenConfiguration.screenLineTime;

            // --- Default tact description
            const tactItem = new RenderingTact();
            tactItem.phase = ScreenRenderingPhase.None;
            tactItem.contentionDelay = 0;

            if (this.screenConfiguration.isTactVisible(line, tactInLine)) {
                // --- Calculate the pixel positions of the area
                const xPos = (tactInLine * 2) & 0xFFFF;
                const yPos = (line - this.screenConfiguration.verticalSyncLines - this.screenConfiguration.nonVisibleBorderTopLines) & 0xFFFF;
                tactItem.pixelIndex = yPos * this._screenWidth + xPos;

                // --- The current tact is in a visible screen area (border or display area)
                if (!this.screenConfiguration.isTactInDisplayArea(line, tactInLine)) {
                    // --- Set the current border color
                    tactItem.phase = ScreenRenderingPhase.Border;
                    if (line >= this.screenConfiguration.firstDisplayLine && line <= this.screenConfiguration.lastDisplayLine) {
                        // --- Left or right border area beside the display area
                        if (tactInLine === this.screenConfiguration.borderLeftTime - this.screenConfiguration.pixelDataPrefetchTime) {
                            // --- Fetch the first pixel data byte of the current line (2 tacts away)
                            tactItem.phase = ScreenRenderingPhase.BorderFetchPixel;
                            tactItem.pixelByteToFetchAddress = this._calculatePixelByteAddress(line, tactInLine + 2);
                            tactItem.contentionDelay = this._contentionType === MemoryContentionType.Ula ? 0 : 2;
                        } 
                        else if (tactInLine === this.screenConfiguration.borderLeftTime - this.screenConfiguration.attributeDataPrefetchTime) {
                            // --- Fetch the first attribute data byte of the current line (1 tact away)
                            tactItem.phase = ScreenRenderingPhase.BorderFetchPixelAttr;
                            tactItem.attributeToFetchAddress = this._calculateAttributeAddress(line, tactInLine + 1);
                            tactItem.contentionDelay = this._contentionType === MemoryContentionType.Ula ? 6 : 1;
                        }
                    }
                } else {
                    // --- According to the tact, the screen rendering involves separate actions
                    const pixelTact = tactInLine - this.screenConfiguration.borderLeftTime;
                    switch (pixelTact & 7) {
                        case 0:
                            // --- While displaying the current tact pixels, we need to prefetch the
                            // --- pixel data byte 4 tacts away
                            tactItem.phase = ScreenRenderingPhase.DisplayB1FetchB2;
                            tactItem.pixelByteToFetchAddress = this._calculatePixelByteAddress(line, tactInLine + 4);
                            tactItem.contentionDelay = this._contentionType === MemoryContentionType.Ula ? 5 : 0;
                            break;
                        case 1:
                            // --- While displaying the current tact pixels, we need to prefetch the
                            // --- attribute data byte 3 tacts away
                            tactItem.phase = ScreenRenderingPhase.DisplayB1FetchA2;
                            tactItem.attributeToFetchAddress = this._calculateAttributeAddress(line, tactInLine + 3);
                            tactItem.contentionDelay = this._contentionType === MemoryContentionType.Ula ? 4 : 7;
                            break;
                        case 2:
                            // --- Display the current tact pixels
                            tactItem.phase = ScreenRenderingPhase.DisplayB1;
                            tactItem.contentionDelay = this._contentionType === MemoryContentionType.Ula ? 3 : 6;
                            break;
                        case 3:
                            // --- Display the current tact pixels
                            tactItem.phase = ScreenRenderingPhase.DisplayB1;
                            tactItem.contentionDelay = this._contentionType === MemoryContentionType.Ula ? 2 : 5;
                            break;
                        case 4:
                            // --- Display the current tact pixels
                            tactItem.phase = ScreenRenderingPhase.DisplayB2;
                            tactItem.contentionDelay = this._contentionType === MemoryContentionType.Ula ? 1 : 4;
                            break;
                        case 5:
                            // --- Display the current tact pixels
                            tactItem.phase = ScreenRenderingPhase.DisplayB2;
                            tactItem.contentionDelay = this._contentionType === MemoryContentionType.Ula ? 0 : 3;
                            break;
                        case 6:
                            if (tactInLine < this.screenConfiguration.borderLeftTime + this.screenConfiguration.displayLineTime - 2) {
                                // --- There are still more bytes to display in this line.
                                // --- While displaying the current tact pixels, we need to prefetch the
                                // --- pixel data byte 2 tacts away
                                tactItem.phase = ScreenRenderingPhase.DisplayB2FetchB1;
                                tactItem.pixelByteToFetchAddress = this._calculatePixelByteAddress(line, tactInLine + 2);
                                tactItem.contentionDelay = this._contentionType === MemoryContentionType.Ula ? 0 : 2;
                            } else {
                                // --- Last byte in this line.
                                // --- Display the current tact pixels
                                tactItem.phase = ScreenRenderingPhase.DisplayB2;
                            }
                            break;
                        case 7:
                            if (tactInLine < this.screenConfiguration.borderLeftTime + this.screenConfiguration.displayLineTime - 1) {
                                // --- There are still more bytes to display in this line.
                                // --- While displaying the current tact pixels, we need to prefetch the
                                // --- attribute data byte 1 tacts away
                                tactItem.phase = ScreenRenderingPhase.DisplayB2FetchA1;
                                tactItem.attributeToFetchAddress = this._calculateAttributeAddress(line, tactInLine + 1);
                                tactItem.contentionDelay = this._contentionType === MemoryContentionType.Ula ? 6 : 1;
                            } else {
                                // --- Last byte in this line.
                                // --- Display the current tact pixels
                                tactItem.phase = ScreenRenderingPhase.DisplayB2;
                            }
                            break;
                    }
                }
            }

            // --- Calculation is ready, let's store the calculated tact item
            this.renderingTactTable[tact] = tactItem;
        }
    }

    /**
     * Calculates the pixel address for the specified line and tact within 
     * the line
     * @param line Line index
     * @param tactInLine Tact index within the line
     * Memory address bits: 
     * C0-C2: pixel count within a byte -- not used in address calculation
     * C3-C7: pixel byte within a line
     * V0-V7: pixel line address
     * 
     * Direct Pixel Address (da)
     * =================================================================
     * |A15|A14|A13|A12|A11|A10|A9 |A8 |A7 |A6 |A5 |A4 |A3 |A2 |A1 |A0 |
     * =================================================================
     * | 0 | 0 | 0 |V7 |V6 |V5 |V4 |V3 |V2 |V1 |V0 |C7 |C6 |C5 |C4 |C3 |
     * =================================================================
     * | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 0xF81F
     * =================================================================
     * | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0x0700
     * =================================================================
     * | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0x00E0
     * =================================================================
     * 
     * Spectrum Pixel Address
     * =================================================================
     * |A15|A14|A13|A12|A11|A10|A9 |A8 |A7 |A6 |A5 |A4 |A3 |A2 |A1 |A0 |
     * =================================================================
     * | 0 | 0 | 0 |V7 |V6 |V2 |V1 |V0 |V5 |V4 |V3 |C7 |C6 |C5 |C4 |C3 |
     * =================================================================
     */
    private _calculatePixelByteAddress(line: number, tactInLine: number): number {
        const row = line - this.screenConfiguration.firstDisplayLine;
        const column = 2 *(tactInLine - this.screenConfiguration.borderLeftTime);
        const da = 0x4000 | (column >> 3) | (row << 5);
        return ((da & 0xF81F)                  // --- Reset V5, V4, V3, V2, V1
            | ((da & 0x0700) >> 3)             // --- Keep V5, V4, V3 only
            | ((da & 0x00E0) << 3)) & 0xFFFF;  // --- Exchange the V2, V1, V0 bit 
                                               // --- group with V5, V4, V3
    }

    /**
     * Calculates the pixel attribute address for the specified line and 
     * tact within the line
     * @param line Line index
     * @param tactInLine Tact index within the line
     * Memory address bits: 
     * C0-C2: pixel count within a byte -- not used in address calculation
     * C3-C7: pixel byte within a line
     * V0-V7: pixel line address
     * 
     * Spectrum Attribute Address
     * =================================================================
     * |A15|A14|A13|A12|A11|A10|A9 |A8 |A7 |A6 |A5 |A4 |A3 |A2 |A1 |A0 |
     * =================================================================
     * | 0 | 1 | 0 | 1 | 1 | 0 |V7 |V6 |V5 |V4 |V3 |C7 |C6 |C5 |C4 |C3 |
     * =================================================================
     */
    private _calculateAttributeAddress(line: number, tactInLine: number): number {
        const row = line - this.screenConfiguration.firstDisplayLine;
        const column = 2 * (tactInLine - this.screenConfiguration.borderLeftTime);
        const da = (column >> 3) | ((row >> 3) << 5);
        return (0x5800 + da) & 0xFFFF;
    }

    /**
     * Fills the entire screen buffer with the specified data
     * @param data Data to fill the pixel buffer
     */
    fillScreenBuffer(data: number): void {
        for (let i = 0; i < this._pixelBuffer.length; i++) {
            this._pixelBuffer[i] = data;
        }
    }
}
