import { TzxDeprecatedDataBlockBase } from "./TzxDeprecatedDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";

/**
 * This block is made to support another type of encoding that is 
 * commonly used by the C64.
 */
export class TzxC64TurboTapeDataBlock extends TzxDeprecatedDataBlockBase {
    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x17;
    }

    /**
     * Reads through the block infromation, and does not store it
     * @param reader Stream to read the block from
     */
    readThrough(reader: BinaryReader): void {
        const length = reader.ReadInt32();
        reader.ReadBytes(length - 4);
    }
}