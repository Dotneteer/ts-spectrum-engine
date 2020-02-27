import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { TzxSymDef } from "./TzxSymDef";
import { TzxPrle } from "./TzxPrle";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * Represents a generalized data block in a TZX file
 */
export class TzxGeneralizedDataBlock extends TzxDataBlockBase {
    /**
     * Block length (without these four bytes)
     */
    blockLength = 0;

    /**
     * Pause after this block 
     */
    pauseAfter = 0;

    /**
     * Total number of symbols in pilot/sync block (can be 0)
     */
    totp = 0;

    /**
     * Maximum number of pulses per pilot/sync symbol
     */
    npp = 0;

    /**
     * Number of pilot/sync symbols in the alphabet table (0=256)
     */
    asp = 0;

    /**
     * Total number of symbols in data stream (can be 0)
     */
    totd = 0;

    /**
     * Maximum number of pulses per data symbol
     */
    npd = 0;

    /**
     * Number of data symbols in the alphabet table (0=256)
     */
    asd = 0;

    /**
     * Pilot and sync symbols definition table.
     * This field is present only if Totp > 0
     */
    pilotSymDef: Array<TzxSymDef> = [];

    /**
     * Pilot and sync data stream.
     * This field is present only if Totd > 0
     */
    pilotStream: Array<TzxPrle> = [];

    /**
     * Data symbols definition table.
     * This field is present only if Totp > 0
     */
    dataSymDef: Array<TzxSymDef> = [];

    /**
     * Data stream
     * This field is present only if Totd > 0
     */
    dataStream: Array<TzxPrle> = [];

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x19;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.blockLength = reader.ReadUInt32();
        this.pauseAfter = reader.ReadUInt16();
        this.totp = reader.ReadUInt32();
        this.npp = reader.ReadByte();
        this.asp = reader.ReadByte();
        this.totd = reader.ReadUInt32();
        this.npd = reader.ReadByte();
        this.asd = reader.ReadByte();

        this.pilotSymDef = [];
        for (let i = 0; i < this.asp; i++) {
            const symDef = new TzxSymDef(this.npp);
            symDef.readFrom(reader);
            this.pilotSymDef[i] = symDef;
        }

        this.pilotStream = [];
        for (let i = 0; i < this.totp; i++) {
            this.pilotStream[i].symbol = reader.ReadByte();
            this.pilotStream[i].repetitions = reader.ReadUInt16();
        }

        this.dataSymDef = [];
        for (let i = 0; i < this.asd; i++) {
            const symDef = new TzxSymDef(this.npd);
            symDef.readFrom(reader);
            this.dataSymDef[i] = symDef;
        }

        this.dataStream = [];
        for (let i = 0; i < this.totd; i++) {
            this.dataStream[i].symbol = reader.ReadByte();
            this.dataStream[i].repetitions = reader.ReadUInt16();
        }
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt32(this.blockLength);
        writer.WriteUInt16(this.pauseAfter);
        writer.WriteUInt32(this.totp);
        writer.WriteByte(this.npp);
        writer.WriteByte(this.asp);
        writer.WriteUInt32(this.totd);
        writer.WriteByte(this.npd);
        writer.WriteByte(this.asd);
        for (let i = 0; i < this.asp; i++) {
            this.pilotSymDef[i].writeTo(writer);
        }
        
        for (let i = 0; i < this.totp; i++) {
            writer.WriteByte(this.pilotStream[i].symbol);
            writer.WriteUInt16(this.pilotStream[i].repetitions);
        }

        for (let i = 0; i < this.asd; i++) {
            this.dataSymDef[i].writeTo(writer);
        }

        for (let i = 0; i < this.totd; i++) {
            writer.WriteByte(this.dataStream[i].symbol);
            writer.WriteUInt16(this.dataStream[i].repetitions);
        }
    }
}