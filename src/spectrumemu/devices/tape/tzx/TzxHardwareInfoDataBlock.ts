import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { TzxHwInfo } from "./TzxHwInfo";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * Represents a hardware info data block
 */
export class TzxHardwareInfoDataBlock extends TzxDataBlockBase {
    /**
     * Number of machines and hardware types for which info is supplied
     */
    hwCount = 0;

        /// <summary>
        /// List of machines and hardware
        /// </summary>
    hwInfo: Array<TzxHwInfo> = [];

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x33;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.hwCount = reader.ReadByte();
        this.hwInfo = [];
        for (let i = 0; i < this.hwCount; i++) {
            const hw = new TzxHwInfo();
            hw.readFrom(reader);
            this.hwInfo[i] = hw;
        }
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteByte(this.hwCount);
        for (const hw of this.hwInfo) {
            hw.writeTo(writer);
        }
    }
}