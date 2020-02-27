import { TzxDeprecatedDataBlockBase } from "./TzxDeprecatedDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";

/**
 * This block was created to support the Commodore 64 standard 
 * ROM and similar tape blocks.
 */
export class TzxSnapshotBlock extends TzxDeprecatedDataBlockBase {
    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x40;
    }

    /**
     * Reads through the block infromation, and does not store it
     * @param reader Stream to read the block from
     */
    readThrough(reader: BinaryReader): void {
        let length = reader.ReadInt32();
        length = length & 0x00FFFFFF;
        reader.ReadBytes(length);
    }
}