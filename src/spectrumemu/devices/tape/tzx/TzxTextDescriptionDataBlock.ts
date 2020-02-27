import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This is meant to identify parts of the tape, so you know where level 1 starts, 
 * where to rewind to when the game ends, etc.
 * This description is not guaranteed to be shown while the tape is playing, 
 * but can be read while browsing the tape or changing the tape pointer.
 */
export class TzxTextDescriptionDataBlock extends TzxDataBlockBase {
    /**
     * Length of the description
     */
    descriptionLength = 0;

    /**
     * The description bytes
     */
    description = new Uint8Array(0);

        /// <summary>
        /// The string form of description
        /// </summary>
    get descriptionText(): string {
        return TzxDataBlockBase.toAsciiString(this.description);
    }

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x30;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.descriptionLength = reader.ReadByte();
        this.description = reader.ReadBytes(this.descriptionLength);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteByte(this.descriptionLength);
        writer.WriteBytes(this.description);
    }
}