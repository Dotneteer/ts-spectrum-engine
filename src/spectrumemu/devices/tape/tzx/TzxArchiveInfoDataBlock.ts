import { Tzx3ByteDataBlockBase } from "./Tzx3ByteDataBlockBase";
import { TzxText } from "./TzxText";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

    /// <summary>
    /// Represents the standard speed data block in a TZX file
    /// </summary>
export class TzxArchiveInfoDataBlock extends Tzx3ByteDataBlockBase {
    /**
     * Length of the whole block (without these two bytes)
     */
    length = 0;

    /**
     * Number of text strings
     */
    stringCount = 0;

    /**
     * List of text strings
     */
    textStrings: Array<TzxText> = [];

        /// <summary>
        /// The ID of the block
        /// </summary>
    
    /**
     * The ID of the block
     */
    get blockId(): number {
            return 0x32;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.length = reader.ReadUInt16();
        this.stringCount = reader.ReadByte();
        this.textStrings = [];
        for (let i = 0; i < this.stringCount; i++) {
            const text = new TzxText();
            text.readFrom(reader);
            this.textStrings[i] = text;
        }
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteByte(this.length);
        writer.WriteByte(this.stringCount);
        for (const text of this.textStrings) {
            text.writeTo(writer);
        }
    }
}