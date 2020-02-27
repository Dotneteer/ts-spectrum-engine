/**
 * This interface describes a device that works with audio samples
 */
export interface IAudioSamplesDevice {
    /**
     * Audio samples to build the audio stream
     */
    readonly audioSamples: number[];

    /**
     * Index of the next audio sample
     */
    readonly nextSampleIndex: number;
}
