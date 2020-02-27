import { PlayPhase } from "./PlayPhase";

/**
 * This class is the base class of all data block types (TAP, TZX, and others)
 */
export abstract class PlayableDataBlockBase {
    /**
     * Signs if the data block support playback
     */
    abstract supportsPlayback(): boolean;

    /**
     * The current playing phase
     */
    abstract get playPhase(): PlayPhase;

    /**
     * The tact count of the CPU when playing starts
     */
    abstract get startTact(): number;

    /**
     * Initializes the player
     * @param startTact CPU tacts when playing starts
     */
    abstract initPlay(startTact: number): void;

    /**
     * The data of the playable block
     */
    abstract data: Uint8Array;

    /**
     * Gets the EAR bit value for the specified tact
     * @param currentTact Tact value to retrieve the EAR bit for
     * @returns The EAR bit value to play back
     */
    abstract getEarBit(currentTact: number): boolean;
}