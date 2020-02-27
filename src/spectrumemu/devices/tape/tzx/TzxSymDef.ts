import { ITapeDataSerialization } from "../ITapeDataSerialization";
import { TzxDataBlockBase } from "./TzxDataBlockBase";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";

/**
 * This block represents an extremely wide range of data encoding techniques.
 * The basic idea is that each loading component (pilot tone, sync pulses, data) 
 * is associated to a specific sequence of pulses, where each sequence (wave) can 
 * contain a different number of pulses from the others. In this way we can have 
 * a situation where bit 0 is represented with 4 pulses and bit 1 with 8 pulses.
 */
export class TzxSymDef implements ITapeDataSerialization {
    /**
     * Bit 0 - Bit 1: Starting symbol polarity:
     * 00: opposite to the current level (make an edge, as usual) - default
     * 01: same as the current level(no edge - prolongs the previous pulse)
     * 10: force low level
     * 11: force high level
     */
    symbolFlags = 0;

    /**
     * The array of pulse lengths
     */
    pulseLengths: Uint16Array;

    /**
     * Initializes the structure
     * @param maxPulses Maximum number of pulses
     */
    constructor(maxPulses: number) {
        this.pulseLengths = new Uint16Array(maxPulses);
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.symbolFlags = reader.ReadByte();
        this.pulseLengths = TzxDataBlockBase.readWords(reader, this.pulseLengths.length);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteByte(this.symbolFlags);
        TzxDataBlockBase.writeWords(writer, this.pulseLengths);
    }
}