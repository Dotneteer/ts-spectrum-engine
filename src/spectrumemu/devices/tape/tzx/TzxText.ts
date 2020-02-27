import { ITapeDataSerialization } from "../ITapeDataSerialization";
import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This is meant to identify parts of the tape, so you know where level 1 starts, 
 * where to rewind to when the game ends, etc.
 * This description is not guaranteed to be shown while the tape is playing, 
 * but can be read while browsing the tape or changing the tape pointer.
 */
export class TzxText implements ITapeDataSerialization {
    /**
     * Text identification byte.
     * 00 - Full title
     * 01 - Software house/publisher
     * 02 - Author(s)
     * 03 - Year of publication
     * 04 - Language
     * 05 - Game/utility type
     * 06 - Price
     * 07 - Protection scheme/loader
     * 08 - Origin
     * FF - Comment(s)
     */
    type = 0;

    /**
     * Length of the description
     */
    length = 0;

    /**
     * The description bytes
     */
    textBytes = new Uint8Array(0);

    /**
     * The string form of description
     */
    get text(): string {
        return TzxDataBlockBase.toAsciiString(this.textBytes);
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.type = reader.ReadByte();
        this.length = reader.ReadByte();
        this.textBytes = reader.ReadBytes(this.length);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteByte(this.type);
        writer.WriteByte(this.length);
        writer.WriteBytes(this.textBytes);
    }
}