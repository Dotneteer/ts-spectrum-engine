import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";
import { ICpuOperationBoundDevice } from "./ICpuOperationBoundDevice";
import { LiteEvent } from "../utils/LiteEvent";

/**
 * This interface represents the device that is responsible for
 * managing the tape
 */
export interface ITapeDevice extends ISpectrumBoundDevice, ICpuOperationBoundDevice {
    /**
     * This flag indicates if the tape is in load mode (EAR bit is set by the tape)
     */
    readonly isInLoadMode: boolean;

    /**
     * Gets the EAR bit read from the tape
     * @param cpuTicks Number of CPU ticks for the sample
     */
    getEarBit(cpuTicks: number): boolean;

    /**
     * Sets the current tape mode according to the current PC register
     * and the MIC bit state
     */
    setTapeMode(): void;

    /**
     * Processes the the change of the MIC bit
     * @param micBit Current MIC bit value
     */
    processMicBit(micBit: boolean): void;

    /**
     * External entities can respond to the event when a fast load completed.
     */
    loadCompleted: LiteEvent<void>;

    /**
     * Signs that the device entered LOAD mode
     */
    enteredLoadMode: LiteEvent<void>;

    /**
     * Signs that the device has just left LOAD mode
     */
    leftLoadMode: LiteEvent<void>;

    /**
     * Signs that the device entered SAVE mode
     */
    enteredSaveMode: LiteEvent<void>;

    /**
     * Signs that the device has just left SAVE mode
     */
    leftSaveMode: LiteEvent<void>;
}