import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This class represents a deprecated block
 */
export abstract class TzxDeprecatedDataBlockBase extends TzxDataBlockBase {
    /**
     * Signs if this block is deprecated
     */
    isDeprecated(): boolean {
        return true;
    }

    /**
     * Reads through the block infromation, and does not store it
     * @param reader Stream to read the block from
     */
    abstract readThrough(reader: BinaryReader): void;

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
            throw new Error("Deprecated TZX data blocks cannot be written.");
    }
}