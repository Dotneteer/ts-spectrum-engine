import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This block marks the start of a group of blocks which are 
 * to be treated as one single (composite) block.
 */
export class TzxGroupStartDataBlock extends TzxDataBlockBase {
    /**
     * Number of group name
     */
    length = 0;

    /**
     * Group name bytes
     */
    chars = new Uint8Array(0);

    /**
     * Gets the group name
     */
    get groupName() {
        return TzxDataBlockBase.toAsciiString(this.chars);
    }

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x21;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.length = reader.ReadByte();
        this.chars = reader.ReadBytes(this.length);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteByte(this.length);
        writer.WriteBytes(this.chars);
    }
}
