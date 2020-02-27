import { TzxDataBlockBase } from "./TzxDataBlockBase";

/**
 * Base class for all TZX block type with data length of 3 bytes
 */
export abstract class Tzx3ByteDataBlockBase extends TzxDataBlockBase {
    /**
     * Used bits in the last byte (other bits should be 0)
     * (e.g. if this is 6, then the bits used(x) in the last byte are: 
     * xxxxxx00, where MSb is the leftmost bit, LSb is the rightmost bit)
     */
    lastByteUsedBits = 0;

    /**
     * Length of block data
     */
    dataLength = new Uint8Array(3);

    /**
     * Override this method to check the content of the block
     */
    isValid(): boolean {
        return this.getLength() === this.data.length;
    }
    
    /**
     * Calculates data length
     */
    protected getLength(): number {
        return this.dataLength[0] + this.dataLength[1] << 8 
            + this.dataLength[2] << 16;
    }
}