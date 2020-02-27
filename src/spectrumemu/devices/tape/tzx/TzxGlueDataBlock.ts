import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This block is generated when you merge two ZX Tape files together.
 * It is here so that you can easily copy the files together and use 
 * them. Of course, this means that resulting file would be 10 bytes 
 * longer than if this block was not used. All you have to do if 
 * you encounter this block ID is to skip next 9 bytes.
 */
export class TzxGlueDataBlock extends TzxDataBlockBase {
    /**
     * Value: { "XTape!", 0x1A, MajorVersion, MinorVersion }.
     * Just skip these 9 bytes and you will end up on the next ID.
     */
    glue = new Uint8Array(0);

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x5A;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.glue = reader.ReadBytes(9);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteBytes(this.glue);
    }
}