import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { Tzx3ByteDataBlockBase } from "../tape/tzx/Tzx3ByteDataBlockBase";

/**
 * This class represents the state of the PSG (Programable Sound Generator)
 */

 // --- Amplitude table
const _amplitudes = 
[
    0.0000, 0.0100, 0.0145, 0.0211,
    0.0307, 0.0455, 0.0645, 0.1074,
    0.1266, 0.2050, 0.2922, 0.3728,
    0.4925, 0.6353, 0.8056, 1.0000
];

// --- Wawe form table
const _waveForm =
[
    0.20, 0.05, 0.00, 0.00,
    0.00, 0.00, 0.05, 0.20,
    0.80, 0.95, 1.00, 1.00,
    1.00, 1.00, 0.95, 0.80
];

/**
 * This structure defines the information about a PSG register
 */
export class PsgRegister {
    Value = 0;
    ModifiedTact = 0;
}

export class PsgState {
    // --- Amplitude table
    // --- Backing fields for registers
    private _regs: PsgRegister[] = [];
    private _noiseSeed = 0;
    private _lastNoiseIndex = 0;

    /**
     * The virtual machine that hosts the PSG
     */
    readonly hostVm: ISpectrumVm;

    /**
     * Initializes the PSG state 
     * @param hostVm Hosting VM
     */
    constructor(hostVm: ISpectrumVm) {
        this.hostVm = hostVm;
        for (let i = 0; i < 16; i++) {
            this._regs[i] = new PsgRegister();
        }
    }

    /**
     * Channel A Fine Tune Register
     */
    get register0() {
        return this._regs[0].Value;
    }

    set register0(value: number) {
        this._regs[0].Value = value & 0xFF;
        this._regs[0].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * Channel A Coarse Tune Register
     */
    get register1() {
        return this._regs[1].Value;
    }

    set register1(value: number) {
        this._regs[1].Value = value & 0x0F;
        this._regs[1].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * Channel A Value
     */
    get channelA(): number {
        return this._regs[1].Value << 8 | this._regs[0].Value;
    }

    /**
     * CPU tact when Channel A value was last time modified
     */
    get channelAModified(): number {
        return this._regs[0].ModifiedTact > this._regs[1].ModifiedTact
        ? this._regs[0].ModifiedTact
        : this._regs[1].ModifiedTact;
    }

    /**
     * Channel B Fine Tune Register
     */
    get register2() {
        return this._regs[2].Value;
    }

    set register2(value: number) {
        this._regs[2].Value = value & 0xFF;
        this._regs[2].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * Channel B Coarse Tune Register
     */
    get register3() {
        return this._regs[3].Value;
    }

    set register3(value: number) {
        this._regs[3].Value = value & 0x0F;
        this._regs[3].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * Channel B Value
     */
    get channelB(): number {
        return this._regs[3].Value << 8 | this._regs[2].Value;
    }

    /**
     * CPU tact when Channel B value was last time modified
     */
    get channelBModified(): number {
        return this._regs[2].ModifiedTact > this._regs[3].ModifiedTact
        ? this._regs[2].ModifiedTact
        : this._regs[3].ModifiedTact;
    }

    /**
     * Channel C Fine Tune Register
     */
    get register4() {
        return this._regs[4].Value;
    }

    set register4(value: number) {
        this._regs[4].Value = value & 0xFF;
        this._regs[4].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * Channel C Coarse Tune Register
     */
    get register5() {
        return this._regs[5].Value;
    }

    set register5(value: number) {
        this._regs[5].Value = value & 0x0F;
        this._regs[5].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * Channel C Value
     */
    get channelC(): number {
        return this._regs[5].Value << 8 | this._regs[4].Value;
    }

    /**
     * CPU tact when Channel C value was last time modified
     */
    get channelCModified(): number {
        return this._regs[4].ModifiedTact > this._regs[5].ModifiedTact
        ? this._regs[4].ModifiedTact
        : this._regs[5].ModifiedTact;
    }

    /**
     * Noise Period Register
     */
    get register6(): number {
        return this._regs[6].Value;
    }

    set register6(value: number) {
        this._regs[6].Value = value & 0x3F;
        this._regs[6].ModifiedTact = this.hostVm.cpu.tacts;
        this._lastNoiseIndex = 0;
    }

    /**
     * CPU tact when Nosie Period value was last time modified
     */
    get noisePeriodModified(): number {
        return this._regs[6].ModifiedTact;
    }

    /**
     * Mixer Control-I/O Enable Register
     */
    get register7(): number {
        return this._regs[7].Value;
    }

    set register7(value: number) {
        this._regs[7].Value = value & 0x7F;
        this._regs[7].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * CPU tact when Mixer register value was last time modified
     */
    get mixerModified(): number {
        return this._regs[7].ModifiedTact;
    }

    /**
     * Input is enabled in Register 7
     */
    get inputEnabled(): boolean {
        return (this._regs[7].Value & 0b0100_0000) === 0;
    }

    /**
     * Tone A is enabled in Register 7
     */
    get toneAEnabled(): boolean {
        return (this._regs[7].Value & 0b0000_0001) === 0;
    }

    /**
     * Tone B is enabled in Register 7
     */
    get toneBEnabled(): boolean {
        return (this._regs[7].Value & 0b0000_0010) === 0;
    } 

    /**
     * Tone C is enabled in Register 7
     */
    get toneCEnabled(): boolean {
        return (this._regs[7].Value & 0b0000_0100) === 0;
    } 

    /**
     * Noise A is enabled in Register 7
     */
    get noiseAEnabled(): boolean {
        return (this._regs[7].Value & 0b0000_1000) === 0;
    }

    /**
     * Noise B is enabled in Register 7
     */
    get noiseBEnabled(): boolean {
        return (this._regs[7].Value & 0b0001_0000) === 0;
    } 

    /**
     * Noise C is enabled in Register 7
     */
    get noiseCEnabled(): boolean {
        return (this._regs[7].Value & 0b0010_0000) === 0;
    } 

    /**
     * Amplitude Control A Register
     */
    get register8(): number {
        return this._regs[8].Value;
    }

    set register8(value: number) {
        this._regs[8].Value = value & 0x1F;
        this._regs[8].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * Gets the amplitude level of Channel A
     */
    get amplitudeA(): number {
        return (this._regs[8].Value & 0x0F);
    } 

    /**
     * CPU tact when Amplitude A register value was last time modified
     */
    get amplitudeAModified(): number {
        return this._regs[8].ModifiedTact;
    } 

    /**
     * Indicates if envelope mode should be used for Channel A
     */
    get useEnvelopeA(): boolean {
        return (this._regs[8].Value & 0b0001_0000) !== 0;
    } 

    /**
     * Amplitude Control B Register
     */
    get register9(): number {
        return this._regs[9].Value;
    }

    set register9(value: number) {
        this._regs[9].Value = value & 0x1F;
        this._regs[9].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * Gets the amplitude level of Channel B
     */
    get amplitudeB(): number {
        return (this._regs[9].Value & 0x0F);
    } 

    /**
     * CPU tact when Amplitude B register value was last time modified
     */
    get amplitudeBModified(): number {
        return this._regs[9].ModifiedTact;
    } 

    /**
     * Indicates if envelope mode should be used for Channel B
     */
    get useEnvelopeB(): boolean {
        return (this._regs[9].Value & 0b0001_0000) !== 0;
    } 

    /**
     * Amplitude Control C Register
     */
    get register10(): number {
        return this._regs[10].Value;
    }

    set register10(value: number) {
        this._regs[10].Value = value & 0x1F;
        this._regs[10].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * Gets the amplitude level of Channel C
     */
    get amplitudeC(): number {
        return (this._regs[10].Value & 0x0F);
    } 

    /**
     * CPU tact when Amplitude C register value was last time modified
     */
    get amplitudeCModified(): number {
        return this._regs[10].ModifiedTact;
    } 

    /**
     * Indicates if envelope mode should be used for Channel B
     */
    get useEnvelopeC(): boolean {
        return (this._regs[10].Value & 0b0001_0000) !== 0;
    } 

    /**
     * Envelope Period LSB Register
     */
    get register11(): number {
        return this._regs[11].Value;
    }

    set register11(value: number) {
        this._regs[11].Value = value;
        this._regs[11].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * Envelope Period MSB Register
     */
    get register12(): number {
        return this._regs[12].Value;
    }

    set register12(value: number) {
        this._regs[12].Value = value & 0xFF;
        this._regs[12].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * CPU tact when Envelope Period value was last time modified
     */
    get envelopePeriodModified(): number {
        return this._regs[11].ModifiedTact > this._regs[12].ModifiedTact
        ? this._regs[11].ModifiedTact
        : this._regs[12].ModifiedTact;
    }

    /**
     * Envelope period value
     */
    get envelopePeriod(): number {
        return (this._regs[12].Value << 8) | this._regs[11].Value;
    }

    /**
     * Envelope shape register
     */
    get register13(): number {
        return this._regs[13].Value;
    }

    set register13(value: number) {
        this._regs[13].Value = value & 0x0F;
        this._regs[13].ModifiedTact = this.hostVm.cpu.tacts;
    }

    /**
     * CPU tact when Envelope Shape register value was last time modified
     */
    get envelopeShapeModified(): number {
        return this._regs[13].ModifiedTact;
    }

    /**
     * Hold flag of the envelope 
     */
    get holdFlag(): boolean {
        return (this._regs[13].Value & 0x01) !== 0;
    } 

    /**
     * Alternate flag of the envelope 
     */
    get alternateFlag(): boolean {
        return (this._regs[13].Value & 0x02) !== 0;
    } 

    /**
     * Attack flag of the envelope 
     */
    get attackFlag(): boolean {
        return (this._regs[13].Value & 0x04) !== 0;
    } 

    /**
     * Continue flag of the envelope 
     */
    get continueFlag(): boolean {
        return (this._regs[13].Value & 0x08) !== 0;
    } 

    /**
     * I/O Port register A
     */
    register14 = 0;

    /**
     * I/O Port register B
     */
    register15 = 0;

    /**
     * Gets a register by its index
     * @param index Register index (should be between 0 and 15)
     */
    getReg(index: number) {
        switch (index & 0x0F) {
            case 0: return this.register0;
            case 1: return this.register1;
            case 2: return this.register2;
            case 3: return this.register3;
            case 4: return this.register4;
            case 5: return this.register5;
            case 6: return this.register6;
            case 7: return this.register7;
            case 8: return this.register8;
            case 9: return this.register9;
            case 10: return this.register10;
            case 11: return this.register11;
            case 12: return this.register12;
            case 13: return this.register13;
            case 14: return this.register14;
            case 15: return this.register15;
        }
        // --- We cannot reach this state
        return 0;
    }

    /**
     * Sets a register by its index
     * @param index Register index (should be between 0 and 15)
     * @param value Register value
     */
    setReg(index: number, value: number) {
        switch (index & 0x0F) {
            case 0: this.register0 = value; break;
            case 1: this.register1 = value; break;
            case 2: this.register2 = value; break;
            case 3: this.register3 = value; break;
            case 4: this.register4 = value; break;
            case 5: this.register5 = value; break;
            case 6: this.register6 = value; break;
            case 7: this.register7 = value; break;
            case 8: this.register8 = value; break;
            case 9: this.register9 = value; break;
            case 10: this.register10 = value; break;
            case 11: this.register11 = value; break;
            case 12: this.register12 = value; break;
            case 13: this.register13 = value; break;
            case 14: this.register14 = value; break;
            case 15: this.register15 = value; break;
        }
    }

    /**
     * Gets the effective value of Channel A
     * @param tact CPU tact to get the sample for
     */
    getChannelASample(tact: number): number {
        if (!this.toneAEnabled || this.channelA === 0) {
            return 0.0;
        }
        const phase = Math.floor(((tact - this.channelAModified) >> 5) % this.channelA * 16 / this.channelA);
        return _waveForm[phase];
    }

    /**
     * Gets the effective value of Channel B
     * @param tact CPU tact to get the sample for
     */
    getChannelBSample(tact: number): number {
        if (!this.toneBEnabled || this.channelB === 0) {
            return 0.0;
        }
        const phase = Math.floor(((tact - this.channelBModified) >> 5) % this.channelB * 16 / this.channelB);
        return _waveForm[phase];
    }

    /**
     * Gets the effective value of Channel C
     * @param tact CPU tact to get the sample for
     */
    getChannelCSample(tact: number): number {
        if (!this.toneCEnabled || this.channelC === 0) {
            return 0.0;
        }
        const phase = Math.floor(((tact - this.channelCModified) >> 5) % this.channelC * 16 / this.channelC);
        return _waveForm[phase];
    }

    /**
     * Gets the effective value of the Noise Generator
     * @param tact CPU tact to get the sample for
     */
    getNoiseSample(tact: number): number {
        if (this.register6 === 0) {
            return 0.0;
        }
        const noiseIndex = Math.floor(((tact - this.noisePeriodModified) >> 5) / this.register6);
        while (noiseIndex > this._lastNoiseIndex) {
            this._noiseSeed = (this._noiseSeed * 2 + 1) ^ (((this._noiseSeed >> 16) ^ (this._noiseSeed >> 13)) & 1);
            this._lastNoiseIndex++;
        }
        return ((this._noiseSeed >> 16) & 1) === 0 ? 0.0 : 1.0;
    }

    /**
     * Gets the effective amplitude of Channel A
     * @param tact CPU tact to get the sample for
     */
    getAmplitudeA(tact: number): number {
        return this.useEnvelopeA ? this.getEnvelopeValue(tact) : _amplitudes[this.amplitudeA];
    }

    /**
     * Gets the effective amplitude of Channel B
     * @param tact CPU tact to get the sample for
     */
    getAmplitudeB(tact: number): number {
        return this.useEnvelopeB ? this.getEnvelopeValue(tact) : _amplitudes[this.amplitudeB];
    }

    /**
     * Gets the effective amplitude of Channel C
     * @param tact CPU tact to get the sample for
     */
    getAmplitudeC(tact: number): number {
        return this.useEnvelopeC ? this.getEnvelopeValue(tact) : _amplitudes[this.amplitudeC];
    }

    /**
     * Gets the current value of envelope multiplier
     * @param tact CPU tact to get the sample for
     */
    getEnvelopeValue(tact: number): number {
        if (this.envelopePeriod === 0) {
            return 0.0;
        }

        // --- Lenght of a period in CPU tacts
        const periodLength = this.envelopePeriod << 9;

        // --- #of envelope period we're in
        const periodCount = Math.floor((tact - this.envelopePeriodModified) / periodLength);

        // --- index of amplitude (0-15) within the current period
        const periodPhase = Math.floor((tact - this.envelopePeriodModified) % periodLength * 16 / periodLength);

        // --- We're in the very first period
        if (periodCount === 0) {
            return this.attackFlag ? _amplitudes[periodPhase] : _amplitudes[15 - periodPhase];
        }

        // --- Process the shape
        if (this.register13 <= 7 || this.register13 === 9 || this.register13 === 15) {
            return 0.0;
        }
        if (this.register13 === 11 || this.register13 === 13) {
            return 1.0;
        }
        if (this.register13 === 12) {
            return _amplitudes[periodPhase];
        }
        if (this.register13 === 8) {
            return _amplitudes[15 - periodPhase];
        }
        return this.register13 === 14
            ? (periodCount % 2 === 0 ? _amplitudes[periodPhase] : _amplitudes[15 - periodPhase])
            : (periodCount % 2 === 1 ? _amplitudes[periodPhase] : _amplitudes[15 - periodPhase]);
    }

    /**
     * Gets the state of the PSG
     */
    getState(): { regs: PsgRegister[], noiseSeed: number, lastNoiseIndex: number } {
        return { regs: this._regs, noiseSeed: this._noiseSeed, lastNoiseIndex: this._lastNoiseIndex};
    }
       

    /**
     * Sets the state of the PSG
     */
    setState(regs: PsgRegister[], noiseSeed: number, lastNoiseIndex: number): void {
        this._regs = regs;
        this._noiseSeed = noiseSeed;
        this._lastNoiseIndex = lastNoiseIndex;
    }
}
