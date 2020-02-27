import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * Represents the standard speed data block in a TZX file
 */
export class TzxPureToneDataBlock extends TzxDataBlockBase {
    /**
     * Pause after this block
     */
    pulseLength = 0;

    /**
     * Lenght of block data
     */
    pulseCount = 0;

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x12;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.pulseLength = reader.ReadUInt16();
        this.pulseCount = reader.ReadUInt16();
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt16(this.pulseLength);
        writer.WriteUInt16(this.pulseCount);
    }
}