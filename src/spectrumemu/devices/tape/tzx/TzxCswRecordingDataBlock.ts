import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * Represents the CSW recording data block in a TZX file
 */
export class TzxCswRecordingDataBlock extends TzxDataBlockBase {
    /**
     * Block length (without these four bytes)
     */
    blockLength = 0;

    /**
     * Pause after this block
     */
    pauseAfter = 0;

    /**
     * Sampling rate
     */
    samplingRate = new Uint8Array(0);

    /**
     * Compression type: 0x01=RLE, 0x02=Z-RLE
     */
    compressionType = 0;

    /**
     * Number of stored pulses (after decompression, for validation purposes)
     */
    pulseCount = 0;

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x18;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.blockLength = reader.ReadUInt32();
        this.pauseAfter = reader.ReadUInt16();
        this.samplingRate = reader.ReadBytes(3);
        this.compressionType = reader.ReadByte();
        this.pulseCount = reader.ReadUInt32();
        const length = this.blockLength - 4 /* PauseAfter*/ - 3 /* SamplingRate */ 
                - 1 /* CompressionType */ - 4 /* PulseCount */;
        this.data = reader.ReadBytes(length);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt32(this.blockLength);
        writer.WriteUInt16(this.pauseAfter);
        writer.WriteBytes(this.samplingRate);
        writer.WriteByte(this.compressionType);
        writer.WriteUInt16(this.pulseCount);
        writer.WriteBytes(this.data);
    }

    /**
     * Override this method to check the content of the block
     */
    isValid(): boolean {
        return this.blockLength === 4 + 3 + 1 + 4 + this.data.length;
    }
}