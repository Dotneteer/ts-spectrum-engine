import { Tzx3ByteDataBlockBase } from "./Tzx3ByteDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

    /// <summary>
    /// 
    /// </summary>
/**
 * Represents a direct recording data block in a TZX file
 */
export class TzxDirectRecordingDataBlock extends Tzx3ByteDataBlockBase {
    /**
     * Number of T-states per sample (bit of data)
     */
    tactsPerSample = 0;

    /**
     * Pause after this block
     */
    pauseAfter = 0;

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x15;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.tactsPerSample = reader.ReadUInt16();
        this.pauseAfter = reader.ReadUInt16();
        this.lastByteUsedBits = reader.ReadByte();
        this.dataLength = reader.ReadBytes(3);
        this.data = reader.ReadBytes(this.getLength());
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt16(this.tactsPerSample);
        writer.WriteUInt16(this.pauseAfter);
        writer.WriteByte(this.lastByteUsedBits);
        writer.WriteBytes(this.dataLength);
        writer.WriteBytes(this.data);
    }
}