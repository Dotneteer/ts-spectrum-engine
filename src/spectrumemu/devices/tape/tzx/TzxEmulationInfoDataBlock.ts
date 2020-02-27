import { TzxDeprecatedDataBlockBase } from "./TzxDeprecatedDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";

/**
 * This is a special block that would normally be generated only by emulators.
 */
export class TzxEmulationInfoDataBlock extends TzxDeprecatedDataBlockBase {
    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x34;
    }

    /**
     * Reads through the block infromation, and does not store it
     * @param reader Stream to read the block from
     */
    readThrough(reader: BinaryReader): void {
        reader.ReadBytes(8);
    }
}