/**
 * This enum represents the operation mode of the tape
 */
export enum TapeOperationMode {
    /**
     * The tape device is passive
     */
    Passive = 0,

    /**
     * The tape device is saving information (MIC pulses)
     */
    Save,

    /**
     * The tape device generates EAR pulses from a player
     */
    Load 
}
