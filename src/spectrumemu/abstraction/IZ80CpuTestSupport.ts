import { OpPrefixMode } from '../cpu/OpPrefixMode';
import { OpIndexMode } from '../cpu/OpIndexMode';
import { MemoryStatusArray } from '../cpu/MemoryStatusArray';

// 
/**
 * This interface defines the operations that support 
 * the testing of a Z80 CPU device.
 */
export interface IZ80CpuTestSupport {
    /**
     * Allows setting the number of tacts
     * @param tacts CPU tacts value to set
     */
    setTacts(tacts: number): void;

    /**
     * Sets the specified interrupt mode
     * @param im interrput mode to set
     */
    setInterruptMode(im: number): void;

    /**
     * Sets the IFF1 and IFF2 flags to the specified value;
     * @param value 
     */
    setIffValues(value: boolean): void;

    /**
     * The current Operation Prefix Mode
     */
    prefixMode: OpPrefixMode;

    /**
     * The current Operation Index Mode
     */
    indexMode: OpIndexMode;

    /**
     * Block interrupts
     */
    blockInterrupt(): void;

    /**
     * Removes the CPU from its halted state
     */
    removeFromHaltedState(): void;

    /**
     * Gets the current execution flow status
     */
    readonly executionFlowStatus: MemoryStatusArray;

    /**
     * Gets the current memory read status
     */
    readonly memoryReadStatus: MemoryStatusArray;

    /**
     * Gets the current memory write status
     */
    readonly memoryWriteStatus: MemoryStatusArray;
}