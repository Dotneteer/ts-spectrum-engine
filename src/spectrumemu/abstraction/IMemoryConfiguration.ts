import { IDeviceConfiguration } from "./IDeviceConfiguration";
import { MemoryContentionType } from "../devices/memory/MemoryContentionType";

/**
 * This interface defines the memory configuration data the virtual machine
 */
export interface IMemoryConfiguration extends IDeviceConfiguration {
    /**
     * This flag indicates whether the device supports banking
     */
    readonly supportsBanking: boolean;

    /**
     * Number of RAM banks with the size of slots.
     * Accepted values are: 4 ... 256
     * Undefined, if banking is not supported.
     */
    readonly ramBanks: number | undefined;

    /**
     * Type of memory contention
     */
    readonly contentionType: MemoryContentionType;

    /**
     * Size of ZX Spectrum Next in MBytes.
     * 0 - Legacy models that do not support Next memory mapping
     * 512 - 512KBytes
     * 1024 - 1024 KBytes
     * 1536 - 1.5MBytes
     * 2048 - 2 MBytes
     */
    readonly nextMemorySize: number;
}