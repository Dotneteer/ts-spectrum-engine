import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * Pause (silence) or 'Stop the Tape' block
 */
export class TzxSilenceDataBlock extends TzxDataBlockBase {
    /**
     * Duration of silence.
     * This will make a silence (low amplitude level (0)) for a given time 
     * in milliseconds. If the value is 0 then the emulator or utility should 
     * (in effect) STOP THE TAPE, i.e. should not continue loading until 
     * the user or emulator requests it.
     */
    duration = 0;

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x20;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.duration = reader.ReadUInt16();
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt16(this.duration);
    }
}