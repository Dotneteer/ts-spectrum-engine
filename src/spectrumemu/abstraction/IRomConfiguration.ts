import { IDeviceConfiguration } from "./IDeviceConfiguration";

/// <summary>
    /// This interface defines the configuration data for the ROM
    /// </summary>
export interface IRomConfiguration extends IDeviceConfiguration {
    /**
     * The number of ROM banks
     */
    readonly numberOfRoms: number;

    /**
     * The name of the ROM file
     */
    readonly romName: string;

    /**
     * The index of the Spectrum 48K BASIC ROM
     */
    readonly spectrum48RomIndex: number;
}