import { IMemoryConfiguration } from "../../abstraction/IMemoryConfiguration";
import { MemoryContentionType } from "./MemoryContentionType";

/**
 * Stores memory configuration data
 */
export class MemoryConfigurationData implements IMemoryConfiguration {
    /**
     * This flag indicates whether the device supports banking
     */
    supportsBanking = false;

    /**
     * Number of RAM banks with the size of slots.
     * Accepted values are: 4 ... 256
     */
    ramBanks: number | undefined = 0;

    /**
     * Type of memory contention
     */
    contentionType = MemoryContentionType.Ula;

    /**
     * Size of ZX Spectrum Next in MBytes.
     * 0 - Legacy models that do not support Next memory mapping
     * 512 - 512KBytes
     * 1024 - 1024 KBytes
     * 1536 - 1.5MBytes
     * 2048 - 2 MBytes
     */
    nextMemorySize = 0;

    /**
     * Returns a clone of this instance
     */
    clone(): MemoryConfigurationData {
        const mc = new MemoryConfigurationData();
        mc.supportsBanking = this.supportsBanking;
        mc.ramBanks = this.ramBanks;
        mc.contentionType = this.contentionType;
        return mc;
    }
}