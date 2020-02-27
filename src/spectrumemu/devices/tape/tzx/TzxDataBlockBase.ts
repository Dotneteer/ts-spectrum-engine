import { ITapeDataSerialization } from "../ITapeDataSerialization";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";
import { PlayPhase } from "../PlayPhase";
import { PlayableDataBlockBase } from "../PlayableDataBlockBase";

/**
 * This class describes a TZX Block
 */
export abstract class TzxDataBlockBase extends PlayableDataBlockBase
    implements ITapeDataSerialization {
    /**
     * The ID of the block
     */
    readonly abstract blockId: number;

    /**
     * Block Data
     */
    data = new Uint8Array(0);

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    abstract readFrom(reader: BinaryReader): void;

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    abstract writeTo(writer: BinaryWriter): void;

    /**
     * Signs if the data block support playback
     */
    supportsPlayback(): boolean {
        return false;
    }

    /**
     * The current playing phase
     */
    get playPhase(): PlayPhase {
        return PlayPhase.None;
    }

    /**
     * The tact count of the CPU when playing starts
     */
    get startTact(): number {
        return 0;
    }

    /**
     * Initializes the player
     * @param startTact CPU tacts when playing starts
     */
    initPlay(startTact: number): void {
    }

    /**
     * Gets the EAR bit value for the specified tact
     * @param currentTact Tact value to retrieve the EAR bit for
     * @returns The EAR bit value to play back
     */
    getEarBit(currentTact: number): boolean {
        return false;
    }

    /**
     * Override this method to check the content of the block
     */
    isValid(): boolean {
        return true;
    }

    /**
     * Signs if this block is deprecated
     */
    isDeprecated(): boolean {
        return false;
    }

    /**
     * Reads the specified number of words from the reader.
     * @param reader Reader that represents the stream
     * @param count Number of words to get
     * @returns The array of words read
     */
    static readWords(reader: BinaryReader, count: number): Uint16Array {
        const result = new Uint16Array(count);
        const bytes = reader.ReadBytes(2 * count);
        for (let i = 0; i < count; i++) {
            result[i] = (bytes[i * 2] + bytes[i * 2 + 1] << 8);
        }
        return result;
    }

    /**
     * Writes the specified array of words to the writer
     * @param writer Writer that represents the team
     * @param words Word array to write out
     */
    static writeWords(writer: BinaryWriter, words: Uint16Array): void {
        for (const word of words) {
            writer.WriteUInt16(word);
        }
    }

    /**
     * Converts the provided bytes to an ASCII string
     * @param bytes Bytes to convert
     * @param offset First byte offset
     * @param count Number of bytes
     */
    static toAsciiString(bytes: Uint8Array, offset = 0, count = -1): string {
        if (count < 0) {
            count = bytes.length - offset;
        }

        let sb = "";
        for (let i = offset; i < count; i++) {
            sb += String.fromCharCode(bytes[i]);
        }
        return sb;
    }
}