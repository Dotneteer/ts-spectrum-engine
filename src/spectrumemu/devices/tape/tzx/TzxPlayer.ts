import { TzxReader } from "./TzxReader";
import { TapeBlockSetPlayer } from "../TapeBlockSetPlayer";
import { BinaryReader } from "../../../utils/BinaryReader";
import { TzxPureDataBlock } from "./TzxPureDataBlock";
import { PlayPhase } from "../PlayPhase";
import { PlayableDataBlockBase } from "../PlayableDataBlockBase";

/**
 * This class is responsible to "play" a TZX file.
 */
export class TzxPlayer extends TzxReader {
    private _player: TapeBlockSetPlayer | undefined;

    /**
     * Signs that the player completed playing back the file
     */
    get eof(): boolean {
        return this._player ? this._player.eof : true;
    }

    /**
     * Initializes the player from the specified reader
     * @param reader BinaryReader instance to get TZX file data from
     */
    constructor(reader: BinaryReader) {
        super(reader);
    }

    /**
     * Reads in the content of the TZX file so that it can be played
     * @returns True, if read was successful; otherwise, false
     */
    readContent(): boolean {
        const success = super.readContent();
        const blocks = this.dataBlocks.filter(b => b.supportsPlayback());
        this._player = new TapeBlockSetPlayer(blocks);
        return success;
    }

    /**
     * Gets the currently playing block's index
     */
    get currentBlockIndex(): number {
        return this._player ? this._player.currentBlockIndex : 0;
    }

    /**
     * The current playable block
     */
    get currentBlock(): PlayableDataBlockBase {
        return this._player ? this._player.currentBlock : new TzxPureDataBlock();
    }

    /**
     * The current playing phase
     */
    get playPhase(): PlayPhase {
        return this._player ? this._player.playPhase : PlayPhase.None;
    }

    /**
     * The tact count of the CPU when playing starts
     */
    get startTact(): number {
        return this._player ? this._player.StartTact : 0;
    }

        /// <summary>
        /// 
        /// </summary>
    /**
     * Initializes the player
     * @param startTact CPU tact to start with
     */
    initPlay(startTact: number): void {
        if (this._player) {
            this._player.initPlay(startTact);
        }
    }

    /**
     * Gets the EAR bit value for the specified tact
     * @param currentTact Tacts to retrieve the EAR bit
     * @returns EAR bit value
     */
    getEarBit(currentTact: number): boolean {
        return this._player ? this._player.getEarBit(currentTact): false;
    }

    /**
     * Moves the current block index to the next playable block
     * @param currentTact Tacts time to start the next block
     */
    nextBlock(currentTact: number): void {
        if (this._player) {
            this._player.nextBlock(currentTact);
        }
    }
}