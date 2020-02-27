import { BinaryReader } from "../../../utils/BinaryReader";
import { TapDataBlock } from "./TapDataBlock";

/**
 * This class reads a TAP file
 */
export class TapReader {
    private readonly _reader: BinaryReader;

    /**
     * Data blocks of this TZX file
     */
    readonly dataBlocks: Array<TapDataBlock>;

    /**
     * Major version number of the file
     */
    majorVersion = 0;

    /**
     * Minor version number of the file
     */
    minorVersion = 0;

    /**
     * Initializes the player from the specified reader
     * @param reader Reader to use with the player
     */
    constructor(reader: BinaryReader) {
        this._reader = reader;
        this.dataBlocks = [];
    }


    /**
     * Reads in the content of the TZX file so that it can be played
     * @returns True, if read was successful; otherwise, false
     */
    readContent(): boolean {
        try {
            while (this._reader.Position !== this._reader.Length) {
                const tapBlock = new TapDataBlock();
                tapBlock.readFrom(this._reader);
                this.dataBlocks.push(tapBlock);
            }
            return true;
        }
        catch {
            // --- This exception is intentionally ignored
            return false;
        }
    }
}