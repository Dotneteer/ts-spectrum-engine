import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This block is an analogue of the CALL Subroutine statement.
 * It basically executes a sequence of blocks that are somewhere 
 * else and then goes back to the next block. Because more than 
 * one call can be normally used you can include a list of sequences 
 * to be called. The 'nesting' of call blocks is also not allowed 
 * for the simplicity reasons. You can, of course, use the CALL 
 * blocks in the LOOP sequences and vice versa.
 */
export class TzxCallSequenceDataBlock extends TzxDataBlockBase {
    /**
     * Number of group name
     */
    numberOfCalls = 0;

    /**
     * Group name bytes
     */
    blockOffsets = new Uint16Array(0);

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x26;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.numberOfCalls = reader.ReadByte();
        this.blockOffsets = TzxDataBlockBase.readWords(reader, this.numberOfCalls);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteByte(this.numberOfCalls);
        TzxDataBlockBase.writeWords(writer, this.blockOffsets);
    }
}