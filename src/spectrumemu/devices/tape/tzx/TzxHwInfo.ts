import { ITapeDataSerialization } from "../ITapeDataSerialization";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This blocks contains information about the hardware that the programs on this tape use.
 */
export class TzxHwInfo implements ITapeDataSerialization {
    /**
     * Hardware type
     */
    hwType = 0;

    /**
     * Hardwer Id
     */
    hwId = 0;

    /**
     * Information about the tape:
     * 00 - The tape RUNS on this machine or with this hardware,
     *      but may or may not use the hardware or special features of the machine.
     * 01 - The tape USES the hardware or special features of the machine,
     *      such as extra memory or a sound chip.
     * 02 - The tape RUNS but it DOESN'T use the hardware
     *      or special features of the machine.
     * 03 - The tape DOESN'T RUN on this machine or with this hardware.
     */
    tapeInfo = 0;

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.hwType = reader.ReadByte();
        this.hwId = reader.ReadByte();
        this.tapeInfo = reader.ReadByte();
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteByte(this.hwType);
        writer.WriteByte(this.hwId);
        writer.WriteByte(this.tapeInfo);
    }
}