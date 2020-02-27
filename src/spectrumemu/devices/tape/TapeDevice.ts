import { ICpuOperationBoundDevice } from "../../abstraction/ICpuOperationBoundDevice";
import { ITapeDevice } from "../../abstraction/ITapeDevice";
import { TapeDeviceType } from "./TapeDeviceType";
import { ITapeDeviceTestSupport } from "../../abstraction/ITapeDeviceTestSupport";
import { IZ80Cpu } from "../../abstraction/IZ80Cpu";
import { IBeeperDevice } from "../../abstraction/IBeeperDevice";
import { IMemoryDevice } from "../../abstraction/IMemoryDevice";
import { TapeOperationMode } from "./TapeOperationMode";
import { CommonTapeFilePlayer } from "./CommonTapeFilePlayer";
import { SavePhase } from "./SavePhase";
import { MicPulseType } from "./MicPulseType";
import { ITapeProvider } from "../../abstraction/ITapeProvider";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { LOAD_BYTES_ROUTINE_ADDRESS, SAVE_BYTES_ROUTINE_ADDRESS, LOAD_BYTES_INVALID_HEADER_ADDRESS, LOAD_BYTES_RESUME_ADDRESS } from "../rom/SpectrumRomDevice";
import { NoopZ80Cpu } from "../../cpu/NoopZ80Cpu";
import { NoopBeeperDevice } from "../beeper/NoopBeeperDevice";
import { NoopMemoryDevice } from "../memory/NoopMemoryDevice";
import { BinaryReader } from "../../utils/BinaryReader";
import { PlayPhase } from "./PlayPhase";
import { FlagsResetMask } from "../../cpu/FlagsResetMask";
import { FlagsSetMask } from "../../cpu/FlagsSetMask";
import { BIT_0_PL, BIT_1_PL, PILOT_PL, SYNC_1_PL, SYNC_2_PL, TERM_SYNC } from "./TapeDataBlockPlayer";
import { TzxStandardSpeedDataBlock } from "./tzx/TzxStandardSpeedDataBlock";
import { LiteEvent } from "../../utils/LiteEvent";

/**
 * Number of tacts after save mod can be exited automatically
 */
export const SAVE_STOP_SILENCE = 17_500_000;

/**
 * The address of the ERROR routine in the Spectrum ROM
 */
export const ERROR_ROM_ADDRESS = 0x0008;

/**
 * The maximum distance between two scans of the EAR bit
 */
export const MAX_TACT_JUMP = 10000;

/**
 * The width tolerance of save pulses
 */
export const SAVE_PULSE_TOLERANCE = 24;

/**
 * Minimum number of pilot pulses before SYNC1
 */
export const MIN_PILOT_PULSE_COUNT = 3000;

/**
 * Lenght of the data buffer to allocate for the SAVE operation
 */
export const DATA_BUFFER_LENGTH = 0x1_0000;

/**
 * This class represents the cassette tape device in ZX Spectrum
 */
export class TapeDevice extends TapeDeviceType implements ITapeDevice, ITapeDeviceTestSupport {
    private _cpu: IZ80Cpu = new NoopZ80Cpu();
    private _beeperDevice: IBeeperDevice = new NoopBeeperDevice();
    private _memoryDevice: IMemoryDevice = new NoopMemoryDevice();
    private _currentMode = TapeOperationMode.Passive;
    private _tapePlayer: CommonTapeFilePlayer = new CommonTapeFilePlayer(new BinaryReader(new Buffer("")));
    private _lastMicBitActivityTact = 0;
    private _micBitState = false;
    private _savePhase = SavePhase.None;
    private _pilotPulseCount = 0;
    private _bitOffset = 0;
    private _dataByte = 0;
    private _dataLength = 0;
    private _dataBuffer = new Uint8Array(0);
    private _dataBlockCount = 0;
    private _prevDataPulse = MicPulseType.None;

    private _loadBytesRoutineAddress = 0;
    private _saveBytesRoutineAddress = 0;
    private _loadBytesInvalidHeaderAddress = 0;
    private _loadBytesResumeAddress = 0;

    private _loadCompleted = new LiteEvent<void>();
    private _enteredLoadMode = new LiteEvent<void>();
    private _leftLoadMode = new LiteEvent<void>();
    private _enteredSaveMode = new LiteEvent<void>();
    private _leftSaveMode = new LiteEvent<void>();

    /**
     * The LOAD_BYTES routine address in the ROM
     */
    get loadBytesRoutineAddress(): number {
        return this._loadBytesRoutineAddress;
    }

    /**
     * The SAVE_BYTES routine address in the ROM
     */
    get saveBytesRoutineAddress(): number {
        return this._saveBytesRoutineAddress;
    }

    /// <summary>
    /// The address to terminate the data block load when the header is
    /// invalid
    /// </summary>
    get loadBytesInvalidHeaderAddress(): number {
        return this._loadBytesInvalidHeaderAddress;
    }

    /**
     * The address to resume after a hooked LOAD_BYTES operation
     */
    get loadBytesResumeAddress(): number {
        return this._loadBytesResumeAddress;
    }

    /**
     * Gets the TZX tape content provider
     */
    readonly tapeProvider: ITapeProvider;

    /**
     * The virtual machine that hosts the device
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * External entities can respond to the event when a fast load completed.
     */
    get loadCompleted(): LiteEvent<void> {
        return this._loadCompleted;
    }

    /**
     * Signs that the device entered LOAD mode
     */
    get enteredLoadMode(): LiteEvent<void> {
        return this._enteredLoadMode;
    }

    /**
     * Signs that the device has just left LOAD mode
     */
    get leftLoadMode(): LiteEvent<void> {
        return this._leftLoadMode;
    }

    /**
     * Signs that the device entered SAVE mode
     */
    get enteredSaveMode(): LiteEvent<void> {
        return this._enteredSaveMode;
    }

    /**
     * Signs that the device has just left SAVE mode
     */
    get leftSaveMode(): LiteEvent<void> {
        return this._leftSaveMode;
    }

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
        this._cpu = hostVm.cpu;
        this._beeperDevice = hostVm.beeperDevice;
        this._memoryDevice = hostVm.memoryDevice;

        const romDevice = this.hostVm.romDevice;
        let addr = romDevice.getKnownAddress(LOAD_BYTES_ROUTINE_ADDRESS, 
            this.hostVm.romConfiguration.spectrum48RomIndex);
        this._loadBytesRoutineAddress = addr ? addr : 0;
        addr = romDevice.getKnownAddress(SAVE_BYTES_ROUTINE_ADDRESS, 
            this.hostVm.romConfiguration.spectrum48RomIndex);
        this._saveBytesRoutineAddress = addr ? addr : 0;
        addr = romDevice.getKnownAddress(LOAD_BYTES_INVALID_HEADER_ADDRESS, 
            this.hostVm.romConfiguration.spectrum48RomIndex);
        this._loadBytesInvalidHeaderAddress = addr ? addr : 0;
        addr = romDevice.getKnownAddress(LOAD_BYTES_RESUME_ADDRESS, 
            this.hostVm.romConfiguration.spectrum48RomIndex);
        this._loadBytesResumeAddress = addr ? addr : 0;
        this.reset();
    }

    /**
     * Initializes the tape device for the specified host VM
     * @param tapeProvider Tape content provider
     */
    constructor(tapeProvider: ITapeProvider) {
        super();
        this.tapeProvider = tapeProvider;
    }

    /**
     * Resets the tape device
     */
    reset(): void {
        this.tapeProvider.reset();
        this._tapePlayer = new CommonTapeFilePlayer(new BinaryReader(new Buffer("")));
        this._currentMode = TapeOperationMode.Passive;
        this._savePhase = SavePhase.None;
        this._micBitState = true;
    }

    /**
     * Gets the state of the device so that the state can be saved
     * @returns The object that describes the state of the device
     */
    getDeviceState() {
    }

    /**
     * Sets the state of the device from the specified object
     * @param state Device state
     */
    restoreDeviceState(state: any): void {
    }


    /**
     * Allow the device to react to the start of a new frame
     */
    onCpuOperationCompleted(): void {
        this.setTapeMode();
        if (this.currentMode === TapeOperationMode.Load
            && this.hostVm.executeCycleOptions.fastTapeMode
            && this.tapeFilePlayer
            && this.tapeFilePlayer.playPhase !== PlayPhase.Completed
            && this._cpu.pc === this.loadBytesRoutineAddress)  {
                
            if (this.fastLoadFromTzx()) {
                this._loadCompleted.trigger();
            }
        }
    }

    /**
     * Sets the current tape mode according to the current PC register
     * and the MIC bit state
     */
    setTapeMode(): void {
        // --- We must use the Spectrum 48K ROM for this mode
        if (this._memoryDevice.getSelectedRomIndex() !== this.hostVm.romConfiguration.spectrum48RomIndex) {
            return;
        }

        switch (this._currentMode) {
            case TapeOperationMode.Passive:
                if (this._cpu.pc === this.loadBytesRoutineAddress) {
                    this.enterLoadMode();
                } 
                else if (this._cpu.pc === this.saveBytesRoutineAddress) {
                    this.enterSaveMode();
                }
                return;
            
            case TapeOperationMode.Save:
                if (this._cpu.pc === ERROR_ROM_ADDRESS 
                    || (this._cpu.tacts - this._lastMicBitActivityTact) > SAVE_STOP_SILENCE) {
                    this.leaveSaveMode();
                }
                return;
                
            case TapeOperationMode.Load:
                if ((!this._tapePlayer || this._tapePlayer.eof) || this._cpu.pc === ERROR_ROM_ADDRESS) {
                    this.leaveLoadMode();
                    this._loadCompleted.trigger();
                }
                return;
        }
    }

    /**
     * Loads the next TZX player block instantly without emulation
     * EAR bit processing.
     * @returns True, if fast load is operative
     */
    fastLoadFromTzx(): boolean {
        // --- Check, if we can load the current block in a fast way
        if (!this.tapeFilePlayer.currentBlock.supportsPlayback
            || this.tapeFilePlayer.playPhase === PlayPhase.Completed) {
            // --- We cannot play this block
            return false;
        }

        const regs = this.hostVm.cpu;
        regs.af = regs._af_;

        // --- Check if the operation is LOAD or VERIFY

        const isVerify = (regs.af & 0xFF01) === 0xFF00;

        // --- At this point IX contains the address to load the data, 
        // --- DE shows the #of bytes to load. A contains 0x00 for header, 
        // --- 0xFF for data block
        const data = this.tapeFilePlayer.currentBlock.data;
        if (data[0] !== regs.a) {
            // --- This block has a different type we're expecting
            regs.a = regs.a ^ regs.l;
            regs.f &= FlagsResetMask.Z;
            regs.f &= FlagsResetMask.C;
            regs.pc = this.loadBytesInvalidHeaderAddress;

            // --- Get the next block
            this.tapeFilePlayer.nextBlock(this._cpu.tacts);
            return true;
        }

        // --- It is time to load the block
        let curIndex = 1;
        const memory = this._memoryDevice;
        regs.h = regs.a;
        while (regs.de > 0) {
            regs.l = data[curIndex];
            if (isVerify && regs.l !== memory.read(regs.ix)) {
            // --- Verify failed
            regs.a = memory.read(regs.ix) ^ regs.l;
            regs.f &= FlagsResetMask.Z;
            regs.f &= FlagsResetMask.C;
            regs.pc = this.loadBytesInvalidHeaderAddress;
                return true;
            }

            // --- Store the loaded data byte
            memory.write(regs.ix, regs.l);
            regs.h ^= regs.l;
            curIndex++;
            regs.ix++;
            regs.de--;
        }

        // --- Check the parity byte at the end of the data stream
        if (curIndex > data.length - 1 || regs.h !== data[curIndex]) {
            // --- Carry is reset to sign an error
            regs.f &= FlagsResetMask.C;
        } else {
            // --- Carry is set to sign success
            regs.f |= FlagsSetMask.C;
        }
        regs.pc = this.loadBytesResumeAddress;

        // --- Get the next block
        this.tapeFilePlayer.nextBlock(this._cpu.tacts);
        return true;
    }

    /**
     * Puts the device in save mode. From now on, every MIC pulse is recorded
     */
    enterSaveMode(): void {
        this._currentMode = TapeOperationMode.Save;
        this._savePhase = SavePhase.None;
        this._micBitState = true;
        this._lastMicBitActivityTact = this._cpu.tacts;
        this._pilotPulseCount = 0;
        this._prevDataPulse = MicPulseType.None;
        this._dataBlockCount = 0;
        this.tapeProvider.createTapeFile();
        this._enteredSaveMode.trigger();
    }

    /**
     * Leaves the save mode. Stops recording MIC pulses
     */
    leaveSaveMode(): void {
        this._currentMode = TapeOperationMode.Passive;
        this.tapeProvider.finalizeTapeFile();
        this._leftSaveMode.trigger();
    }

    /**
     * Puts the device in load mode. From now on, EAR pulses are played by a device
     */
    enterLoadMode(): void {
        this._currentMode = TapeOperationMode.Load;
        this._enteredLoadMode.trigger();

        const contentReader = this.tapeProvider.getTapeContent();
        if (!contentReader.HasContent) {
            return;
        }

        // --- Play the content
        this._tapePlayer = new CommonTapeFilePlayer(contentReader);
        this._tapePlayer.readContent();
        this._tapePlayer.initPlay(this._cpu.tacts);
        this.hostVm.beeperDevice.setTapeOverride(true);
    }

    /**
     * Leaves the load mode. Stops the device that playes EAR pulses
     */
    leaveLoadMode(): void {
        this._currentMode = TapeOperationMode.Passive;
        this._tapePlayer = new CommonTapeFilePlayer(new BinaryReader(new Buffer("")));
        this.tapeProvider.reset();
        this.hostVm.beeperDevice.setTapeOverride(false);
        this._leftLoadMode.trigger();
    }

    /**
     * Gets the EAR bit read from the tape
     * @param cpuTicks Tact to get the EAR bit for
     */
    getEarBit(cpuTicks: number): boolean {
        if (this._currentMode !== TapeOperationMode.Load) {
            return true;
        }
        const earBit = this._tapePlayer.getEarBit(cpuTicks);
        this._beeperDevice.processEarBitValue(true, earBit);
        return earBit;
    }

    /**
     * This flag indicates if the tape is in load mode (EAR bit is set by the tape)
     */
    get isInLoadMode(): boolean {
        return this._currentMode === TapeOperationMode.Load;
    }

    /**
     * Processes the the change of the MIC bit
     * @param micBit MIC bit to process
     */
    processMicBit(micBit: boolean): void {
        if (this._currentMode !== TapeOperationMode.Save
            || this._micBitState === micBit) {
            return;
        }

        const length = this._cpu.tacts - this._lastMicBitActivityTact;

        // --- Classify the pulse by its width
        let pulse = MicPulseType.None;
        if (length >= BIT_0_PL - SAVE_PULSE_TOLERANCE
            && length <= BIT_0_PL + SAVE_PULSE_TOLERANCE) {
            pulse = MicPulseType.Bit0;
        } 
        else if (length >= BIT_1_PL - SAVE_PULSE_TOLERANCE
            && length <= BIT_1_PL + SAVE_PULSE_TOLERANCE) {
            pulse = MicPulseType.Bit1;
        }
        else if (length >= PILOT_PL - SAVE_PULSE_TOLERANCE
            && length <= PILOT_PL + SAVE_PULSE_TOLERANCE) {
            pulse = MicPulseType.Pilot;
        }
        else if (length >= SYNC_1_PL - SAVE_PULSE_TOLERANCE
            && length <= SYNC_1_PL + SAVE_PULSE_TOLERANCE) {
            pulse = MicPulseType.Sync1;
        }
        else if (length >= SYNC_2_PL - SAVE_PULSE_TOLERANCE
            && length <= SYNC_2_PL + SAVE_PULSE_TOLERANCE) {
            pulse = MicPulseType.Sync2;
        }
        else if (length >= TERM_SYNC - SAVE_PULSE_TOLERANCE
            && length <= TERM_SYNC + SAVE_PULSE_TOLERANCE) {
            pulse = MicPulseType.TermSync;
        }
        else if (length < SYNC_1_PL - SAVE_PULSE_TOLERANCE) {
            pulse = MicPulseType.TooShort;
        }
        else if (length > PILOT_PL + 2 * SAVE_PULSE_TOLERANCE) {
            pulse = MicPulseType.TooLong;
        }

        this._micBitState = micBit;
        this._lastMicBitActivityTact = this._cpu.tacts;

        // --- Lets process the pulse according to the current SAVE phase and pulse width
        var nextPhase = SavePhase.Error;
        switch (this._savePhase) {
            case SavePhase.None:
                if (pulse === MicPulseType.TooShort || pulse === MicPulseType.TooLong) {
                    nextPhase = SavePhase.None;
                } 
                else if (pulse === MicPulseType.Pilot) {
                    this._pilotPulseCount = 1;
                    nextPhase = SavePhase.Pilot;
                }
                break;

            case SavePhase.Pilot:
                if (pulse === MicPulseType.Pilot) {
                    this._pilotPulseCount++;
                    nextPhase = SavePhase.Pilot;
                }
                else if (pulse === MicPulseType.Sync1 
                    && this._pilotPulseCount >= MIN_PILOT_PULSE_COUNT) {
                    nextPhase = SavePhase.Sync1;
                }
                break;

            case SavePhase.Sync1:
                if (pulse === MicPulseType.Sync2) {
                    nextPhase = SavePhase.Sync2;
                }
                break;
                
            case SavePhase.Sync2:
                if (pulse === MicPulseType.Bit0 || pulse === MicPulseType.Bit1) {
                    // --- Next pulse starts data, prepare for receiving it
                    this._prevDataPulse = pulse;
                    nextPhase = SavePhase.Data;
                    this._bitOffset = 0;
                    this._dataByte = 0;
                    this._dataLength = 0;
                    this._dataBuffer = new Uint8Array(DATA_BUFFER_LENGTH);
                }
                break;
                
            case SavePhase.Data:
                if (pulse === MicPulseType.Bit0 || pulse === MicPulseType.Bit1) {
                    if (this._prevDataPulse === MicPulseType.None) {
                        // --- We are waiting for the second half of the bit pulse
                        this._prevDataPulse = pulse;
                        nextPhase = SavePhase.Data;
                    }
                    else if (this._prevDataPulse === pulse) {
                        // --- We received a full valid bit pulse
                        nextPhase = SavePhase.Data;
                        this._prevDataPulse = MicPulseType.None;

                        // --- Add this bit to the received data
                        this._bitOffset++;
                        this._dataByte = this._dataByte * 2 + (pulse === MicPulseType.Bit0 ? 0 : 1);
                        if (this._bitOffset === 8) {
                            // --- We received a full byte
                            this._dataBuffer[this._dataLength++] = this._dataByte;
                            this._dataByte = 0;
                            this._bitOffset = 0;
                        }
                    }
                }
                else if (pulse === MicPulseType.TermSync) {
                    // --- We received the terminating pulse, the datablock has been completed
                    nextPhase = SavePhase.None;
                    this._dataBlockCount++;

                    // --- Create and save the data block
                    const dataBlock = new TzxStandardSpeedDataBlock();
                    dataBlock.data = this._dataBuffer,
                    dataBlock.dataLength = this._dataLength;

                    // --- If this is the first data block, extract the name from the header
                    if (this._dataBlockCount === 1 && this._dataLength === 0x13) {
                        // --- It's a header!
                        let sb = "";
                        for (let i = 2; i <= 11; i++) {
                            sb += String.fromCharCode(this._dataBuffer[i]);
                        }
                        this.tapeProvider.setName(sb.trim());
                    }
                    this.tapeProvider.saveTapeBlock(dataBlock);
                }
                break;
        }
        this._savePhase = nextPhase;
    }

    /**
     * The current operation mode of the tape
     */
    get currentMode(): TapeOperationMode {
        return this._currentMode;
    }

    /**
     * The TzxPlayer that can playback tape content
     */
    get tapeFilePlayer(): CommonTapeFilePlayer {
        return this._tapePlayer;
    }

    /**
     * The CPU tact of the last MIC bit activity
     */
    get lastMicBitActivityTact(): number {
        return this._lastMicBitActivityTact;
    }

    /**
     * Gets the current state of the MIC bit
     */
    get micBitState(): boolean {
        return this._micBitState;
    }

    /**
     * The current phase of the SAVE operation
     */
    get savePhase(): SavePhase {
        return this._savePhase;
    }

    /**
     * The number of PILOT pulses emitted
     */
    get pilotPulseCount(): number {
        return this._pilotPulseCount;
    }

    /**
     * The bit offset within a byte when data is emitted
     */
    get bitOffset(): number {
        return this._bitOffset;
    }

    /**
     * The current data byte emitted
     */
    get dataByte(): number {
        return this._dataByte;
    }

    /**
     * The number of bytes emitted in the current data block
     */
    get dataLength(): number {
        return this._dataLength;
    }

    /**
     * The buffer that holds the emitted data block
     */
    get dataBuffer(): Uint8Array {
        return this._dataBuffer;
    }

    /**
     * The previous data pulse emitted
     */
    get prevDataPulse(): MicPulseType {
        return this._prevDataPulse;
    }

    /**
     * The number of data blocks saved
     */
    get dataBlockCount(): number {
        return this._dataBlockCount;
    }
}
