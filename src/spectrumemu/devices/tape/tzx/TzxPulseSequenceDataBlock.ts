import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

    /// <summary>
    /// Represents the standard speed data block in a TZX file
    /// </summary>
export class TzxPulseSequenceDataBlock extends TzxDataBlockBase {
    /**
     * Pause after this block
     */
    pulseCount = 0;

    /**
     * Length of block data
     */
    pulseLengths = new Uint16Array(0);

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x13;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.pulseCount = reader.ReadByte();
        this.pulseLengths = TzxDataBlockBase.readWords(reader, this.pulseCount);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteByte(this.pulseCount);
        TzxDataBlockBase.writeWords(writer, this.pulseLengths);
        }

    /**
     * Override this method to check the content of the block
     */
    isValid(): boolean {
        return this.pulseCount === this.pulseLengths.length;
    }
}