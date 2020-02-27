import { IDeviceConfiguration } from "./IDeviceConfiguration";

/**
 * This interface represents the configuration of the floppy device
 */
export interface IFloppyConfiguration extends IDeviceConfiguration {
    /**
     * Does the computer have a floppy drive?
     */
    readonly floppyPresent: boolean;

    /**
     * Is drive B present?
     */
    readonly driveBPresent: boolean;
}
