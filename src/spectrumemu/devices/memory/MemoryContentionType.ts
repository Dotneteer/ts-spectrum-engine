/**
 * This enumeration represents the contention type of memory
 */
export enum MemoryContentionType {
    /**
     * No contended memory
     */
    None,

    /**
     * ULA-type memory contention
     */
    Ula,

    /**
     * Gate-array-type memory contention
     */
    GateArray,

    /**
     * Spectrum Next type memory contention
     */
    Next
}