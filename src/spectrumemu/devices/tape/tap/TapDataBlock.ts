import { ITapeData } from "../ITapeData";
import { ITapeDataSerialization } from "../ITapeDataSerialization";
import { TapeDataBlockPlayer } from "../TapeDataBlockPlayer";
import { BinaryReader } from "../../../utils/BinaryReader";
import { BinaryWriter } from "../../../utils/BinaryWriter";
import { PlayPhase } from "../PlayPhase";
import { PlayableDataBlockBase } from "../PlayableDataBlockBase";

/**
 * This class describes a TAP Block
 */
export class TapDataBlock extends PlayableDataBlockBase
    implements ITapeData, ITapeDataSerialization {
    
    private _player: TapeDataBlockPlayer | undefined;

    /**
     * Block Data
     */
    data = new Uint8Array(0);

    /**
     * Pause after this block (given in milliseconds)
     */
    pauseAfter = 1000;

    /**
     * Reads the content of the block from the specified binary stream.
     * @param reader Stream to read the block from
     */
    readFrom(reader: BinaryReader): void {
        const length = reader.ReadUInt16();
        this.data = reader.ReadBytes(length);
    }

    /**
     * Writes the content of the block to the specified binary stream.
     * @param writer Stream to write the block to
     */
    writeTo(writer: BinaryWriter): void {
        writer.WriteUInt16(this.data.length);
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
     * Signs if the data block support playback
     */
    supportsPlayback(): boolean {
        return false;
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
}