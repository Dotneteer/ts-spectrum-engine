import { TapeOperationMode } from "../devices/tape/TapeOperationMode";
import { CommonTapeFilePlayer } from "../devices/tape/CommonTapeFilePlayer";
import { SavePhase } from "../devices/tape/SavePhase";
import { MicPulseType } from "../devices/tape/MicPulseType";

/**
 * This interface defines the operations that support 
 * the testing of a tape device
 */
export interface ITapeDeviceTestSupport {
    /**
     * The current operation mode of the tape
     */
    readonly currentMode: TapeOperationMode;

    /**
     * The object that can playback tape content
     */
    readonly tapeFilePlayer: CommonTapeFilePlayer;

    /**
     * The CPU tact of the last MIC bit activity
     */
    readonly lastMicBitActivityTact: number;

    /**
     * Gets the current state of the MIC bit
     */
    readonly micBitState: boolean;

    /**
     * The current phase of the SAVE operation
     */
    readonly savePhase: SavePhase;

    /**
     * The number of PILOT pulses emitted
     */
    readonly pilotPulseCount: number;

    /**
     * The bit offset within a byte when data is emitted
     */
    readonly bitOffset: number;

    /**
     * The current data byte emitted
     */
    readonly dataByte: number;

    /**
     * The number of bytes emitted in the current data block
     */
    readonly dataLength: number;

    /**
     * The buffer that holds the emitted data block
     */
    readonly dataBuffer: Uint8Array;

    /**
     * The previous data pulse emitted
     */
    readonly prevDataPulse: MicPulseType;

    /**
     * The number of data blocks saved
     */
    readonly dataBlockCount: number;
}