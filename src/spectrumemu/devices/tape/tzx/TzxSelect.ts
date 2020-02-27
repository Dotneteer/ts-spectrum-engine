import { ITapeDataSerialization } from "../ITapeDataSerialization";
import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This block represents select structure
 */
export class TzxSelect implements ITapeDataSerialization {
    /**
     * Bit 0 - Bit 1: Starting symbol polarity
     * 00: opposite to the current level (make an edge, as usual) - default
     * 01: same as the current level(no edge - prolongs the previous pulse)
     * 10: force low level
     * 11: force high level
     */
    blockOffset = 0;

    /**
     * Length of the description
     */
    descriptionLength = 0;

    /**
     * The description bytes
     */
    description = new Uint8Array(0);

    /**
     * The string form of description
     */
    get descriptionText(): string {
        return TzxDataBlockBase.toAsciiString(this.description);
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.blockOffset = reader.ReadUInt16();
        this.descriptionLength = reader.ReadByte();
        this.description = reader.ReadBytes(this.descriptionLength);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt16(this.blockOffset);
        writer.WriteByte(this.descriptionLength);
        writer.WriteBytes(this.description);
    }
}