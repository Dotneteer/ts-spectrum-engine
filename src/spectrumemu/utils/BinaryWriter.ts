/**
 * This class allows you to write binary information to a file or buffer
 */
export class BinaryWriter {
    /** 
     * Initializes a binary reader that writes information to a buffer
     * @param buffer Buffer to read form
     */
    constructor(buffer: Buffer) {
        // TODO: Implement this
    }

    /**
     * Writes a single byte to the stream
     * @param byte Byte to write
     */
    WriteByte(byte: number) {
        // TODO: Implement this
    }

    /**
     * Writes a 16-bit unsigned integer to the stream.
     * @param word UInt16 to write
     */
    WriteUInt16(word: number): void {
        // TODO: Implement this
    }

    /**
     * Writes the array of bytes to the stream
     * @param bytes Byte array to write to the stream
     */
    WriteBytes(bytes: Uint8Array) {
        // TODO: Implement this
    }

    /**
     * Writes the array of bytes to the stream
     * @param bytes Byte array to write to the stream
     * @param offset Start offset
     * @param length #of bytes to write
     */
    WriteBuffer(bytes: Uint8Array, offset: number, length: number) {
        // TODO: Implement this
    }

    /**
     * Writes a 32-bit unsigned integer to the stream.
     * @param num UInt32 to write
     */
    WriteUInt32(num: number) {
        // TODO: Implement this
    }

    /**
     * Writes a 16-bit signed integer to the stream.
     * @param num Int16 to write
     */
    WriteInt16(num: number): void {
        // TODO: Implement this
    }
}