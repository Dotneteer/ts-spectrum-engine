import { IFloppyConfiguration } from "../../abstraction/IFloppyConfiguration";

/**
 * This class represents the floppy configuration
 */
export class FloppyConfigurationData implements IFloppyConfiguration {
    /**
     * Does the computer have a floppy drive?
     */
    floppyPresent = false;

    /**
     * Is drive B present?
     */
    driveBPresent = false;

    /**
     * Returns a clone of this instance
     */
    clone(): FloppyConfigurationData {
        const fc =  new FloppyConfigurationData();
        fc.floppyPresent = this.floppyPresent;
        fc.driveBPresent = this.driveBPresent;
        return fc;
    }
}