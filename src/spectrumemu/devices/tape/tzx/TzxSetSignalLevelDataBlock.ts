import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This block sets the current signal level to the specified value (high or low).
 */
export class TzxSetSignalLevelDataBlock extends TzxDataBlockBase {
    /**
     * Length of the block without these four bytes
     */
    readonly lenght = 1;

    /**
     * Signal level (0=low, 1=high)
     */
    signalLevel = 0;

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x2B;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        reader.ReadUInt32();
        this.signalLevel = reader.ReadByte();
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt32(this.lenght);
        writer.WriteByte(this.signalLevel);
    }
}