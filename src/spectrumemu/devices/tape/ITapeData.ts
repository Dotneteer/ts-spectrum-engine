/**
 * Represetns the data in the tape
 */
export interface ITapeData {
    /**
     * Block Data
     */
    data: Uint8Array;

    /**
     * Pause after this block (given in milliseconds)
     */
    pauseAfter: number;
}