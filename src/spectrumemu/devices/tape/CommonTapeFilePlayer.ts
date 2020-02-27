import { BinaryReader } from "../../utils/BinaryReader";
import { TapeBlockSetPlayer } from "./TapeBlockSetPlayer";
import { PlayableDataBlockBase } from "./PlayableDataBlockBase";
import { TzxReader } from "./tzx/TzxReader";
import { TapReader } from "./tap/TapReader";
import { PlayPhase } from "./PlayPhase";

/**
 * This class recognizes .TZX and .TAP files, and playes back
 * the content accordingly.
 */
export class CommonTapeFilePlayer {
    private readonly _reader: BinaryReader;
    private _player: TapeBlockSetPlayer = new TapeBlockSetPlayer([]);

    /**
     * Data blocks to play back
     */
    dataBlocks: PlayableDataBlockBase[] = [];

    /**
     * Signs that the player completed playing back the file
     */
    get eof(): boolean {
        return this._player.eof;
    }

    /**
     * Initializes the player from the specified reader
     * @param reader BinaryReader instance to get TZX file data from
     */
    constructor(reader: BinaryReader) {
        this._reader = reader;
    }

        /// <summary>
        /// Reads in the content of the TZX file so that it can be played
        /// </summary>
        /// <returns>True, if read was successful; otherwise, false</returns>
    readContent(): boolean {
        // --- First try TzxReader
        const tzxReader = new TzxReader(this._reader);
        let readerFound = false;
        try {
            readerFound = tzxReader.readContent();
        }
        catch {
            // --- This exception is intentionally ingnored
        }

        if (readerFound) {
            // --- This is a .TZX format
            this.dataBlocks = tzxReader.dataBlocks.filter(b => b.supportsPlayback());
            this._player = new TapeBlockSetPlayer(this.dataBlocks);
            return true;
        }

        // --- Let's assume .TAP tap format
        this._reader.Seek(0);
        var tapReader = new TapReader(this._reader);
        readerFound = tapReader.readContent();
        this.dataBlocks = tapReader.dataBlocks;
        this._player = new TapeBlockSetPlayer(this.dataBlocks);
        return readerFound;
    }

    /**
     * Gets the currently playing block's index
     */
    get currentBlockIndex(): number {
        return this._player.currentBlockIndex;
    }

    /**
     * The current playable block
     */
    get currentBlock(): PlayableDataBlockBase {
        return this._player.currentBlock;
    }

    /**
     * The current playing phase
     */
    get playPhase(): PlayPhase {
        return this._player.playPhase;
    }

    /**
     * The tact count of the CPU when playing starts
     */
    get startTact(): number {
        return this._player.StartTact;
    }

    /**
     * Initializes the player
     * @param startTact 
     */
    initPlay(startTact: number): void {
        this._player.initPlay(startTact);
    }

    /**
     * Gets the EAR bit value for the specified tact.
     * @param currentTact Tact to retrieve the EAR bit for
     */
    getEarBit(currentTact: number): boolean {
        return this._player.getEarBit(currentTact);
    }

    /**
     * Moves the current block index to the next playable block
     * @param currentTact Tacts time to start the next block
     */
    nextBlock(currentTact: number): void {
        this._player.nextBlock(currentTact);
    }
}