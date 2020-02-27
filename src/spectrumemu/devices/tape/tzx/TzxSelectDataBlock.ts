import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { TzxSelect } from "./TzxSelect";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * Represents a select data block
 */
export class TzxSelectDataBlock extends TzxDataBlockBase {
    /**
     * Length of the whole block (without these two bytes)
     */
    length = 0;

    /**
     * Number of selections
     */
    selectionCount = 0;
    
    /**
     * List of selections
     */
    selections: Array<TzxSelect> = [];

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x28;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.length = reader.ReadUInt16();
        this.selectionCount = reader.ReadByte();
        this.selections = [];
        for (let i = 0; i < this.selectionCount; i++) {
            const selection = new TzxSelect();
            selection.readFrom(reader);
            this.selections[i] = selection;
        }
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt16(this.length);
        writer.WriteByte(this.selectionCount);
        for (const selection of this.selections) {
            selection.writeTo(writer);
        }
    }
}