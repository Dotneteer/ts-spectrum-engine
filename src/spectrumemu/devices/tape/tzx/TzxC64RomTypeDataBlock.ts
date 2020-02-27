import { TzxDeprecatedDataBlockBase } from "./TzxDeprecatedDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";

    /// <summary>
    /// This block was created to support the Commodore 64 standard 
    /// ROM and similar tape blocks.
    /// </summary>
export class TzxC64RomTypeDataBlock extends TzxDeprecatedDataBlockBase {
    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x16;
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