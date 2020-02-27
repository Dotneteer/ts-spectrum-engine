import { ISoundDevice } from "../../abstraction/ISoundDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { PsgState } from "./PsgState";
import { SoundDeviceType } from "./SoundDeviceType";
import { LiteEvent } from "../../utils/LiteEvent";

/**
 * This class represents the sound device based on the AY-3-8912 PSG chip
 */
export class SoundDevice extends SoundDeviceType implements ISoundDevice {
    private _firstTacts = 0;
    private _accSamples = 0;
    private _frameBegins = 0;
    private _frameTacts = 0;
    private _sampleRate = 0;
    private _samplesPerFrame: number = 0;
    private _tactsPerSample = 0;
    private _frameCompleted = new LiteEvent<void>();

    /**
     * The virtual machine that hosts the device
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     *  Audio samples to build the audio stream
     */
    public audioSamples: number[] = [];

    /**
     * Index of the next audio sample
     */
    public nextSampleIndex = 0;

    /**
     * The index of the last addressed register
     */
    lastRegisterIndex = 0;

    /**
     * The last PSG state collected during the last frame
     */
    psgState: PsgState = new PsgState(new NoopSpectrumVm());

    /**
     * The offset of the last recorded sample
     */
    lastSampleTact = 0;

    /**
     * #of frames rendered
     */
    frameCount = 0;

    /**
     * Overflow from the previous frame, given in #of tacts 
     */
    overflow = 0;

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
        this._frameTacts = hostVm.frameTacts;
        this.overrideSampleRate(24000);
    }

    /**
     * Resets this device
     */
    reset(): void {
        this._firstTacts = this._frameBegins = this.hostVm.cpu.tacts;
        this._accSamples = 0;
        this.lastRegisterIndex = 0;
        this.psgState = new PsgState(this.hostVm);
        for (var i = 0; i < 0x0F; i++) {
            this.psgState.setReg(i, 0);
        }
        this.frameCount = 0;
        this.overflow = 0;
        this.setRegisterValue(0);
        this.initializeSampling();
    }

    /**
     * The current audio sample rate
     */
    get sampleRate(): number {
        return this._sampleRate;
    }

    /**
     * Allows overriding the sample rate
     * @param sampleRate New sample rate
     */
    overrideSampleRate(sampleRate: number): void {
        this._sampleRate = sampleRate;
        this._samplesPerFrame = this.hostVm.screenConfiguration.screenRenderingFrameTactCount * sampleRate
                / this.hostVm.baseClockFrequency / this.hostVm.clockMultiplier;
        this._tactsPerSample = Math.ceil(this.hostVm.screenConfiguration.screenRenderingFrameTactCount/this._samplesPerFrame);
        this.reset();
    }

    /**
     * Gets the current state of the device
     */
    getDeviceState(): any {
        return undefined;
    }

    /**
     * Restores the state of the device from the specified object
     * @param state Device state
     */
    restoreDeviceState(state: any): void {
    }

    /**
     * Allow the device to react to the start of a new frame
     */
    onNewFrame(): void {
        this.frameCount++;
        this.initializeSampling();

        if (this.overflow !== 0) {
            // --- Managed overflown samples
            this.createSamples(this._frameBegins + this.overflow);
        }
        this.overflow = 0;
    }

    /**
     * Allow the device to react to the completion of a frame
     */
    onFrameCompleted(): void {
        if (this.lastSampleTact < this._frameBegins + this._frameTacts) {
            // --- Expand the samples till the end of the frame
            this.createSamples(this._frameBegins + this._frameTacts);
        }
        if (this.hostVm.cpu.tacts > this._frameBegins + this._frameTacts) {
            // --- Sign overflow tacts
            this.overflow = this.hostVm.cpu.tacts - this._frameBegins - this._frameTacts;
        }
        this._frameBegins += this._frameTacts;
    }

    /**
     * Allow external entities respond to frame completion
     */
    get frameCompleted(): LiteEvent<void> {
        return this._frameCompleted;
    }


    /**
     * Sets the index of the PSG register
     * @param index Register index
     */
    setRegisterIndex(index: number): void {
        this.lastRegisterIndex = index;
    }

    /**
     * Sets the value of the register according to the
     * last register index
     * @param value Register value
     */
    setRegisterValue(value: number): void {
        this.createSamples(this.hostVm.cpu.tacts);
        this.psgState.setReg(this.lastRegisterIndex, value);
    }

    /**
     * Gets the value of the register according to the
     * last register index
     */
    getRegisterValue(): number {
        return this.psgState.getReg(this.lastRegisterIndex);
    }

    /**
     * Sets up sampling ionformation for the forthcoming frame
     */
    private initializeSampling(): void {
        const nextSamplesCount = this._firstTacts + (this.frameCount + 1) * this._samplesPerFrame;
        this.lastSampleTact = this._frameBegins % this._tactsPerSample === 0
            ? this._frameBegins
            : this._frameBegins + this._tactsPerSample - 
                (this._frameBegins + this._tactsPerSample) % this._tactsPerSample;
        const samplesInFrame = Math.floor(nextSamplesCount - this._accSamples);
        this._accSamples += samplesInFrame;
        // --- Empty the samples array
        this.audioSamples = [];
        for (let i = 0; i < samplesInFrame; i++) {
            this.audioSamples[i] = 0.0;
        }
        this.nextSampleIndex = 0;
    }

    /**
     * Create samples according the specified ear bit
     * @param cpuTacts Sampling CPU tact
     */
    private createSamples(cpuTacts: number): void {
        let nextSampleOffset = this.lastSampleTact;
        if (cpuTacts > this._frameBegins + this._frameTacts) {
            cpuTacts = this._frameBegins + this._frameTacts;
        }
        while (nextSampleOffset <= cpuTacts) {
            this.audioSamples[this.nextSampleIndex++] = this.createSampleFor(nextSampleOffset);
            nextSampleOffset += this._tactsPerSample;
        }
        if (this.nextSampleIndex < this.audioSamples.length) {
            const lastSample = this.audioSamples[this.nextSampleIndex - 1];
            for (let i = this.nextSampleIndex; i < this.audioSamples.length; i++) {
                this.audioSamples[i] = lastSample;
            }
        }
        this.lastSampleTact = nextSampleOffset;
    }

    /**
     * Create the PSG sample for the specified tact
     * @param tact CPU tact to create the sample for
     */
    createSampleFor(tact: number): number {
        const noise = this.psgState.getNoiseSample(tact);
        let channelA = this.psgState.getChannelASample(tact);
        if (this.psgState.noiseAEnabled && noise > channelA) {
            channelA = noise;
        }
        let channelB = this.psgState.getChannelBSample(tact);
        if (this.psgState.noiseBEnabled && noise > channelB) {
            channelB = noise;
        }
        let channelC = this.psgState.getChannelCSample(tact);
        if (this.psgState.noiseCEnabled && noise > channelC) {
            channelC = noise;
        }

        // --- Mix channels
        const sample = (channelA * this.psgState.getAmplitudeA(tact) + 
            channelB * this.psgState.getAmplitudeB(tact) + 
            channelC * this.psgState.getAmplitudeC(tact)) / 3;
        return sample;
    }
}