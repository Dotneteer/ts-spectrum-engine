import { BinaryReader } from "../utils/BinaryReader";
import { IVmComponentProvider } from "./IVmComponentProvider";
import { ITapeDataSerialization } from "../devices/tape/ITapeDataSerialization";

/**
 * This interface describes the behavior of an object that
 * provides tape content
 */
export interface ITapeProvider extends IVmComponentProvider {
    /**
     * Gets a binary reader that provides tape content
     */
    getTapeContent(): BinaryReader;

    /**
     * Creates a tape file with the specified name
     */
    createTapeFile(): void;

    /**
     * This method sets the name of the file according to the 
     * Spectrum SAVE HEADER information
     * @param name Filename
     */
    setName(name: string): void;

    /**
     * Appends the TZX block to the tape file
     * @param block Block to append
     */
    saveTapeBlock(block: ITapeDataSerialization): void;

    /**
     * The tape provider can finalize the tape when all 
     * Blocks are written out.
     */
    finalizeTapeFile(): void;
}