import { Tzx3ByteDataBlockBase } from "./Tzx3ByteDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * Represents the standard speed data block in a TZX file
 */
export class TzxPureDataBlock extends Tzx3ByteDataBlockBase {
    /**
     * Length of the zero bit
     */
    zeroBitPulseLength = 0;

    /**
     * Length of the one bit
     */
    oneBitPulseLength = 0;

    /**
     * Pause after this block
     */
    pauseAfter = 0;

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x14;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.zeroBitPulseLength = reader.ReadUInt16();
        this.oneBitPulseLength = reader.ReadUInt16();
        this.lastByteUsedBits = reader.ReadByte();
        this.pauseAfter = reader.ReadUInt16();
        this.dataLength = reader.ReadBytes(3);
        this.data = reader.ReadBytes(this.getLength());
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt16(this.zeroBitPulseLength);
        writer.WriteUInt16(this.oneBitPulseLength);
        writer.WriteByte(this.lastByteUsedBits);
        writer.WriteUInt16(this.pauseAfter);
        writer.WriteBytes(this.dataLength);
        writer.WriteBytes(this.data);
    }
}