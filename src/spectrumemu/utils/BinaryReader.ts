import * as fs from 'fs';

/**
 * This class allows you to read binary information from a file or a buffer
 */
export class BinaryReader {
    private _buffer: Buffer;
    private _position: number;

    /** 
     * Initializes a binary reader that reads information from a buffer
     * @param bufferOrString Buffer or file name to read form
     */
    constructor(bufferOrString: Buffer | string) {
        if (typeof bufferOrString === "string") {
            try {
                this._buffer = fs.readFileSync(bufferOrString);
            }
            catch {
                this._buffer = new Buffer(0);
            }
        } else {
            this._buffer = bufferOrString;
        }
        this._position = 0;
    }

    /**
     * Gets the current stream position
     */
    get Position(): number {
        return this._position;
    }

    /**
     * Seeks the specified position
     * @param position Position to seek foor
     */
    Seek(position: number): void {
        if (position < 0) {
            throw new Error("Stream position cannot be negative");
        }
        if (position > this._buffer.length) {
            throw new Error("Stream position is over the end of the stream");
        } else {
            this._position = position;
        }
    }

    /**
     * Get the length of the stream
     */
    get Length(): number {
        return this._buffer.length;
    }

    /**
     * Tests if the reader has contents at all
     */
    get HasContent(): boolean {
        return this.Length > 0;
    }

    /**
     * Test is the current position is at the end of the file
     */
    get eof(): boolean {
        return this._position >= this._buffer.length;
    }

    /**
     * Reads the specified number of bytes from the stream
     * @param count Number of bytes to read
     */
    ReadBytes(count: number): Uint8Array {
        if (this._position + count >= this._buffer.length) {
            count = this._buffer.length - this._position;
        }
        if (count < 0) {
            count = 0;
        }
        const result = new Uint8Array(count);
        for (let i = 0; i < count; i++) {
            result[i] = this._buffer[this._position++];
        }
        return result;
    }

    /**
     * Reads a single byte from the stream
     */
    ReadByte(): number {
        this._testEof();
        return this._buffer[this._position++];
    }

    /**
     * Reads a 16-bit unsigned integer from the stream
     */
    ReadUInt16(): number {
        return this.ReadByte() + (this.ReadByte() << 8);
    }

    /**
     * Reads a 32-bit signed integer from the stream
     */
    ReadInt32(): number {
        const val = this.ReadByte() + (this.ReadByte() << 8)
            + (this.ReadByte() << 16) + (this.ReadByte() << 24);
        return val > 2147483647 ? val - 4294967296 : val;
    }

    /**
     * Reads a 32-bit unsigned integer from the stream
     */
    ReadUInt32(): number {
        const val = this.ReadByte() + (this.ReadByte() << 8)
            + (this.ReadByte() << 16) + (this.ReadByte() << 24);
        return val < 0 ? val + 4294967296 : val;
    }

     /**
     * Reads a 16-bit signed integer from the stream
     */
    ReadInt16(): number {
        const val = this.ReadByte() + (this.ReadByte() << 8);
        return val > 32767 ? val - 65536 : val;
    }

    /**
     * Tests if end of file is reached
     */
    private _testEof(): void {
        if (this.eof) {
            throw new Error("End of file reached");
        }
    }
}