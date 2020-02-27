import { ICpuConfiguration } from "../abstraction/ICpuConfiguration";

export class CpuConfigurationData implements ICpuConfiguration {
    /**
     * The clock frequency of the CPU
     */
    baseClockFrequency = 0;

    /**
     * This value allows to multiply clock frequency. Accepted values are:
     * 1, 2, 4, 8
     */
    clockMultiplier = 0;

    /**
     * Reserved for future use
     */
    supportsNextOperations = false;

    clone(): CpuConfigurationData {
        const cd = new CpuConfigurationData();
        cd.baseClockFrequency = this.baseClockFrequency;
        cd.clockMultiplier = this.clockMultiplier;
        cd.supportsNextOperations = this.supportsNextOperations;
        return cd;
    }
}