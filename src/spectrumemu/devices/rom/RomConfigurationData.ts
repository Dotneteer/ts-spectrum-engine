import { IRomConfiguration } from "../../abstraction/IRomConfiguration";

/**
 * Stores ROM configuration data
 */
export class RomConfigurationData implements IRomConfiguration {
    /**
     * The number of ROM banks
     */
    numberOfRoms = 0;

    /**
     * The name of the ROM file
     */
    romName = "";

    /**
     * The index of the Spectrum 48K BASIC ROM
     */
    spectrum48RomIndex = 0;

    /**
     * Returns a clone of this instance
     */
    clone(): RomConfigurationData {
        const rd = new RomConfigurationData();
        rd.numberOfRoms = this.numberOfRoms;
        rd.romName = this.romName;
        rd.spectrum48RomIndex = this.spectrum48RomIndex;
        return rd;
    }
}