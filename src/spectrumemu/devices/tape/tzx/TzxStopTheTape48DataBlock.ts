import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * When this block is encountered, the tape will stop ONLY if 
 * the machine is an 48K Spectrum.
 * This block is to be used for multiloading games that load one 
 * level at a time in 48K mode, but load the entire tape at once 
 * if in 128K mode. This block has no body of its own, but follows 
 * the extension rule.
 */
export class TzxStopTheTape48DataBlock extends TzxDataBlockBase {
    /**
     * Length of the block without these four bytes (0)
     */
    readonly lenght = 0;

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x2A;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        reader.ReadUInt32();
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt32(this.lenght);
    }
}