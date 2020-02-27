import { PlayPhase } from "./PlayPhase";
import { TzxDataBlockBase } from "./tzx/TzxDataBlockBase";
import { PlayableDataBlockBase } from "./PlayableDataBlockBase";

/**
 * This class is responsible to "play" a tape file.
 */
export class TapeBlockSetPlayer {
    /**
     * All data blocks that can be played back
     */
    readonly dataBlocks: Array<PlayableDataBlockBase>;

    /**
     * Signs that the player completed playing back the file
     */
    eof = false;

    /**
     * Gets the currently playing block's index
     */
    currentBlockIndex = 0;

    /**
     * The current playable block
     */
    get currentBlock(): PlayableDataBlockBase {
        return this.dataBlocks[this.currentBlockIndex];
    }

    /**
     * The current playing phase
     */
    playPhase = PlayPhase.None;

    /**
     * The tact count of the CPU when playing starts
     */
    StartTact = 0;

    constructor(dataBlocks: Array<PlayableDataBlockBase>) {
        this.dataBlocks = dataBlocks;
        this.eof = dataBlocks.length === 0;
    }

    /**
     * Initializes the player
     * @param startTact CPU tacts when playing starts
     */
    initPlay(startTact: number): void {
        this.currentBlockIndex = -1;
        this.nextBlock(startTact);
        this.playPhase = PlayPhase.None;
        this.StartTact = startTact;
    }

    /**
     * Gets the EAR bit value for the specified tact
     * @param currentTact Tact value to retrieve the EAR bit for
     * @returns The EAR bit value to play back
     */
    getEarBit(currentTact: number): boolean {
        // --- Check for EOF
        if (this.currentBlockIndex === this.dataBlocks.length - 1 
            && (this.currentBlock.playPhase === PlayPhase.Pause 
                || this.currentBlock.playPhase === PlayPhase.Completed)) {
            this.eof = true;
        }
        if (this.currentBlockIndex >= this.dataBlocks.length || this.currentBlock === undefined) {
            // --- After all playable block played back, there's nothing more to do
            this.playPhase = PlayPhase.Completed;
            return true;
        }
        let earbit = this.currentBlock.getEarBit(currentTact);
        if (this.currentBlock.playPhase === PlayPhase.Completed) {
            this.nextBlock(currentTact);
        }
        return earbit;
    }

    /**
     * Moves the player to the next playable block
     * @param currentTact Tacts time to start the next block
     */
    nextBlock(currentTact: number): void {
        if (this.currentBlockIndex >= this.dataBlocks.length - 1) {
            this.playPhase = PlayPhase.Completed;
            this.eof = true;
            return;
        }
        this.currentBlockIndex++;
        this.currentBlock.initPlay(currentTact);
    }
}