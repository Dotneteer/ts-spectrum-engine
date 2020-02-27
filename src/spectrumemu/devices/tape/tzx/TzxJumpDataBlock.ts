import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This block will enable you to jump from one block to another within the file.
 * Jump 0 = 'Loop Forever' - this should never happen
 * Jump 1 = 'Go to the next block' - it is like NOP in assembler
 * Jump 2 = 'Skip one block'
 * Jump -1 = 'Go to the previous block'
 */
export class TzxJumpDataBlock extends TzxDataBlockBase {
    /**
     * Relative jump value
     */
    jump = 0;

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x23;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.jump = reader.ReadInt16();
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteInt16(this.jump);
    }
}