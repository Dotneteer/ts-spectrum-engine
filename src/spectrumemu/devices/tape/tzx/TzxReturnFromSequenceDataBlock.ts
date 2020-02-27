import { TzxBodylessDataBlockBase } from "./TzxBodylessDataBlockBase";

/**
 * This block indicates the end of the Called Sequence.
 * The next block played will be the block after the last 
 * CALL block
 */
export class TzxReturnFromSequenceDataBlock extends TzxBodylessDataBlockBase {
    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x27;
    }
}