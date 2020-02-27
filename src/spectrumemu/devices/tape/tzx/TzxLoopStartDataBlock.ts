import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * If you have a sequence of identical blocks, or of identical 
 * groups of blocks, you can use this block to tell how many 
 * times they should be repeated.
 */
export class TzxLoopStartDataBlock extends TzxDataBlockBase {
    /**
     * Number of repetitions (greater than 1)
     */
    loops = 0;

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x24;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.loops = reader.ReadUInt16();
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt16(this.loops);
    }
}