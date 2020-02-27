import { BinaryReader } from "../../utils/BinaryReader";
import { BinaryWriter } from "../../utils/BinaryWriter";

/**
 * Defines the serialization operations of a TZX record
 */
export interface ITapeDataSerialization {
    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void;

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void;
}