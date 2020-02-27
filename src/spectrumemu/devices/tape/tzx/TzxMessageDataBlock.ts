import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This will enable the emulators to display a message for a given time.
 * This should not stop the tape and it should not make silence. If the 
 * time is 0 then the emulator should wait for the user to press a key.
 */
export class TzxMessageDataBlock extends TzxDataBlockBase {
    /**
     * Time (in seconds) for which the message should be displayed
     */
    time = 0;

    /**
     * Length of the description
     */
    messageLength = 0;

    /**
     * The description bytes
     */
    message = new Uint8Array(0);

    /**
     * The string form of description
     */
    get messageText(): string {
        return TzxDataBlockBase.toAsciiString(this.message);
    }

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x31;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.time = reader.ReadByte();
        this.messageLength = reader.ReadByte();
        this.message = reader.ReadBytes(this.messageLength);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteByte(this.time);
        writer.WriteByte(this.messageLength);
        writer.WriteBytes(this.message);
    }
}