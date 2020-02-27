import { TzxBodylessDataBlockBase } from "./TzxBodylessDataBlockBase";

/**
 * This indicates the end of a group. This block has no body.
 */
export class TzxGroupEndDataBlock extends TzxBodylessDataBlockBase {
    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x22;
    }
}
