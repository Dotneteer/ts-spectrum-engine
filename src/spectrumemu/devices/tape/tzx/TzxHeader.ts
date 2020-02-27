import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

const TzxSignature = new Uint8Array([ 0x5A, 0x58, 0x54, 0x61, 0x70, 0x65, 0x21 ]);

/**
 * Represents the header of the TZX file
 */
export class TzxHeader extends TzxDataBlockBase {
    /**
     * Signature bytes
     */
    signature: Uint8Array;

    /**
     * End of Tape sign
     */
    eot: number;
    
    /**
     * Major TZX version
     */
    majorVersion: number;

    /**
     * Minor TZX version
     */
    minorVersion: number;

    constructor(majorVersion = 1, minorVersion = 20) {
        super();
        this.signature = new Uint8Array(TzxSignature);
        this.eot = 0x1A;
        this.majorVersion = majorVersion;
        this.minorVersion = minorVersion;
    }

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x00;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.signature = reader.ReadBytes(7);
        this.eot = reader.ReadByte();
        this.majorVersion = reader.ReadByte();
        this.minorVersion = reader.ReadByte();
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteBytes(this.signature);
        writer.WriteByte(this.eot);
        writer.WriteByte(this.majorVersion);
        writer.WriteByte(this.minorVersion);
        }

     /**
     * Override this method to check the content of the block
     */
    isValid(): boolean {
        return this._equals(this.signature, TzxSignature)
            && this.eot === 0x1A
            && this.majorVersion === 1;
        }
    
    /**
     * Compares two Uint8Array instances
     */
    private _equals (buf1: Uint8Array, buf2: Uint8Array) {
        if (buf1.byteLength !== buf2.byteLength) {
            return false;
        }
        var dv1 = new Int8Array(buf1);
        var dv2 = new Int8Array(buf2);
        for (let i = 0 ; i !== buf1.byteLength ; i++) {
            if (dv1[i] !== dv2[i]) {
                return false;
            }
        }
        return true;
    }
}