import { Tzx3ByteDataBlockBase } from "./Tzx3ByteDataBlockBase";
import { ITapeData } from "../ITapeData";
import { TapeDataBlockPlayer } from "../TapeDataBlockPlayer";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";
import { PlayPhase } from "../PlayPhase";

    /// <summary>
    /// Represents the standard speed data block in a TZX file
    /// </summary>
export class TzxTurboSpeedDataBlock extends Tzx3ByteDataBlockBase
    implements ITapeData {
    
    private _player: TapeDataBlockPlayer | undefined;

    /**
     * Length of pilot pulse
     */
    pilotPulseLength: number;

    /**
     * Length of the first sync pulse
     */
    sync1PulseLength: number;

    /**
     * Length of the second sync pulse
     */
    sync2PulseLength: number;

    /**
     * Length of the zero bit
     */
    zeroBitPulseLength: number;

    /**
     * Length of the one bit
     */
    oneBitPulseLength: number;

    /**
     * Length of the pilot tone
     */
    pilotToneLength: number;

    /**
     * Pause after this block
     */
    pauseAfter: number;

    constructor() {
        super();
        this.pilotPulseLength = 2168;
        this.sync1PulseLength = 667;
        this.sync2PulseLength = 735;
        this.zeroBitPulseLength = 855;
        this.oneBitPulseLength = 1710;
        this.pilotToneLength = 8063;
        this.lastByteUsedBits = 8;
        this.pauseAfter = 1000;
    }

    /**
     * The ID of the block
     */
    get blockId(): number {
        return 0x11;
    }

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        this.pilotPulseLength = reader.ReadUInt16();
        this.sync1PulseLength = reader.ReadUInt16();
        this.sync2PulseLength = reader.ReadUInt16();
        this.zeroBitPulseLength = reader.ReadUInt16();
        this.oneBitPulseLength = reader.ReadUInt16();
        this.pilotToneLength = reader.ReadUInt16();
        this.lastByteUsedBits = reader.ReadByte();
        this.pauseAfter = reader.ReadUInt16();
        this.dataLength = reader.ReadBytes(3);
        this.data = reader.ReadBytes(this.getLength());
    }

        /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt16(this.pilotPulseLength);
        writer.WriteUInt16(this.sync1PulseLength);
        writer.WriteUInt16(this.sync2PulseLength);
        writer.WriteUInt16(this.zeroBitPulseLength);
        writer.WriteUInt16(this.oneBitPulseLength);
        writer.WriteUInt16(this.pilotToneLength);
        writer.WriteByte(this.lastByteUsedBits);
        writer.WriteUInt16(this.pauseAfter);
        writer.WriteBytes(this.dataLength);
        writer.WriteBytes(this.data);
    }

    /**
     * The index of the currently playing byte
     */
    get byteIndex(): number {
        return this._player ? this._player.byteIndex : 0;
    }

    /**
     * The mask of the currently playing bit in the current byte
     */
    get bitMask(): number {
        return this._player ? this._player.bitMask : 0;
    }

    /**
     * The current playing phase
     */
    get playPhase(): PlayPhase {
        return this._player ? this._player.playPhase : PlayPhase.None;
    }

    /**
     * The tact count of the CPU when playing starts
     */
    get startTact(): number {
        return this._player ? this._player.startTact : 0;
    }

    /**
     * Last tact queried
     */
    get lastTact(): number {
        return this._player ? this._player.lastTact : 0;
    }


    /**
     * Initializes the player
     * @param startTact CPU tacts when playing starts
     */
    initPlay(startTact: number): void {
        this._player = new TapeDataBlockPlayer(this.data, this.pauseAfter);
        this._player.pilotPulseLength = this.pilotPulseLength;
        this._player.sync1PulseLength = this.sync1PulseLength;
        this._player.sync2PulseLength = this.sync2PulseLength;
        this._player.zeroBitPulseLength = this.zeroBitPulseLength;
        this._player.oneBitPulseLength = this.oneBitPulseLength;
        this._player.headerPilotToneLength = this.pilotToneLength;
        this._player.dataPilotToneLength = this.pilotToneLength;
        this._player.initPlay(startTact);
    }

    /**
     * Gets the EAR bit value for the specified tact
     * @param currentTact Tact value to retrieve the EAR bit for
     * @returns The EAR bit value to play back
     */
    getEarBit(currentTact: number): boolean {
        return this._player ? this._player.getEarBit(currentTact) : false;
    }

    /**
     * Signs if the data block support playback
     */
    supportsPlayback(): boolean {
        return true;
    }
}