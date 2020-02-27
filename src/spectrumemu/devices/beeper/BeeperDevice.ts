import { BeeperDeviceType } from "./BeeperDeviceType";
import { IBeeperDevice } from "../../abstraction/IBeeperDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { LiteEvent } from "../../utils/LiteEvent";

export class BeeperDevice extends BeeperDeviceType implements IBeeperDevice {
    private _firstTacts = 0;
    private _accSamples = 0;
    private _frameBegins: number = 0;
    private _frameTacts: number = 0;
    private _sampleRate = 0;
    private _tactsPerSample: number = 0;
    private _samplesPerFrame: number = 0;
    private _useTapeMode: boolean = false;
    private _frameCompleted = new LiteEvent<void>();

    /**
     * Audio samples to build the audio stream
     */
    audioSamples: number[] = [];

    /**
     * Index of the next audio sample
     */
    nextSampleIndex: number = 0;

    /**
     * The virtual machine that hosts the device
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * This device processes so many samples in a single frame
     */
    get samplesPerFrame(): number {
        return this._samplesPerFrame;
    }

    /**
     * Number of CPU tacts between samples
     */
    get tactsPerSample(): number {
        return this._tactsPerSample;
    }

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
        this.lastEarBit = false;
        this.frameCount = 0;
        this.overflow = 0;
        this._useTapeMode = false;
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
     * Gets the last value of the EAR bit
     */
    lastEarBit: boolean = true;

    /**
     * The offset of the last recorded sample
     */
    lastSampleTact: number = 0;

    /**
     * #of frames rendered
     */
    frameCount: number = 0;

    /**
     * Overflow from the previous frame, given in #of tacts 
     */
    overflow: number = 0;

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
     * Processes the change of the EAR bit value
     * @param fromTape False: EAR bit comes from an OUT instruction, True: EAR bit comes from tape
     * @param earBit EAR bit value
     */
    processEarBitValue(fromTape: boolean, earBit: boolean): void {
        if (!fromTape && this._useTapeMode) {
            // --- The EAR bit comes from and OUT instruction, but now we're in tape mode
            return;
        }
        if (earBit === this.lastEarBit) {
            // --- The earbit has not changed
            return;
        }
        this.createSamples(this.hostVm.cpu.tacts);
        this.lastEarBit = earBit;
    }

    /**
     * This method signs that tape should override the OUT instruction's EAR bit
     * @param useTape True: Override the OUT instruction with the tape's EAR bit value
     */
    setTapeOverride(useTape: boolean): void {
        this._useTapeMode = useTape;
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
            this.audioSamples[this.nextSampleIndex++] = 
                this.lastEarBit ? 1.0 : 0.0;
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
}
