import { Tzx3ByteDataBlockBase } from "./Tzx3ByteDataBlockBase";
import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * Represents the standard speed data block in a TZX file
 */
export class TzxCustomInfoDataBlock extends Tzx3ByteDataBlockBase {
    /**
     * Identification string (in ASCII)
     */
    id = new Uint8Array(0);

        /// <summary>
        /// String representation of the ID
        /// </summary>
    get IdText() {
        return TzxDataBlockBase.toAsciiString(this.id);
    }

    /**
     * Length of the custom info
     */
    length = 0;

    /**
     * Custom information
     */
    customInfo = new Uint8Array(0);

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x35;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.id = reader.ReadBytes(10);
        this.length = reader.ReadUInt32();
        this.customInfo = reader.ReadBytes(this.length);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteBytes(this.id);
        writer.WriteUInt32(this.length);
        writer.WriteBytes(this.customInfo);
    }
}