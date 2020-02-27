import { IFrameBoundDevice } from "./IFrameBoundDevice";
import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";
import { IAudioSamplesDevice } from "./IAudioSampleDevice";

/**
 * This interface represents the beeper device in the Spectrum VM
 */
export interface IBeeperDevice extends IFrameBoundDevice, ISpectrumBoundDevice, IAudioSamplesDevice {
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
     * Gets the last value of the EAR bit
     */
    readonly lastEarBit: boolean;

    /**
     * The offset of the last recorded sample
     */
    readonly lastSampleTact: number;

    /**
     * This device processes so many samples in a single frame
     */
    readonly samplesPerFrame: number;

    /**
     * Number of CPU tacts between samples
     */
    readonly tactsPerSample: number;

    /**
     * Processes the change of the EAR bit value
     * @param fromTape False: EAR bit comes from an OUT instruction, True: EAR bit comes from tape
     * @param earBit EAR bit value
     */
    processEarBitValue(fromTape: boolean, earBit: boolean): void;

    /**
     * This method signs that tape should override the OUT instruction's EAR bit
     * @param useTape True: Override the OUT instruction with the tape's EAR bit value
     */
    setTapeOverride(useTape: boolean): void;
}