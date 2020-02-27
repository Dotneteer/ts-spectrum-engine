import { IFrameBoundDevice } from "./IFrameBoundDevice";
import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";
import { IAudioSamplesDevice } from "./IAudioSampleDevice";
import { PsgState } from "../devices/sound/PsgState";

/**
 * This interface represents the PSG device of a Spectrum 128/+2/+3
 * virtual machine
 */
export interface ISoundDevice extends IFrameBoundDevice, ISpectrumBoundDevice, IAudioSamplesDevice {
    /**
     * The current audio sample rate
     */
    readonly sampleRate: number;

    /**
     * Allows overriding the sample rate
     * @param sampleRate New sample rate
     */
    overrideSampleRate(sampleRate: number): void;

    /**
     * The offset of the last recorded sample
     */
    readonly lastSampleTact: number;

    /**
     * The last PSG state collected during the last frame
     */
    readonly psgState: PsgState;

    /**
     * The index of the last addressed register
     */
    readonly lastRegisterIndex: number;

    /**
     * Sets the index of the PSG register
     * @param index Register index
     */
    setRegisterIndex(index: number): void;

    /**
     * Sets the value of the register according to the
     * last register index
     * @param value Register value
     */
    setRegisterValue(value: number): void;

    /**
     * Gets the value of the register according to the
     * last register index
     */
    getRegisterValue(): number;
}