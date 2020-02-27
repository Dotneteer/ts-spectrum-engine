import { IDeviceConfiguration } from "./IDeviceConfiguration";

/**
 * This interface defines the configuration data for Z80 CPU
 */
export interface ICpuConfiguration extends IDeviceConfiguration {
    /**
     * The clock frequency of the CPU
     */
    readonly baseClockFrequency: number;

    /**
     * This value allows to multiply clock frequency. Accepted values are:
     * 1, 2, 4, 8
     */
    readonly clockMultiplier: number;

    /**
     * Reserved for future use
     */
    readonly supportsNextOperations: boolean;
}