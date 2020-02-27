import { IKeyboardDevice } from "../../abstraction/IKeyboardDevice";
import { IKeyboardProvider } from "../../abstraction/IKeyboardProvider";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { SpectrumKeyCode } from "./SpectrumKeyCode";
import { KeyboardDeviceType } from "./KeyboardDeviceType";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { NoopKeyboardProvider } from "./NoopKeyboardProvider";
import { DT_KEYBOARD } from "../DeviceTypes";
import { LiteEvent } from "../../utils/LiteEvent";

/**
 * This device manages the keyboard of the Spectrum virtual machine
 */
export class KeyboardDevice extends KeyboardDeviceType implements IKeyboardDevice {
    private _keyboardProvider: IKeyboardProvider = new NoopKeyboardProvider();
    private _lineStatus: number[];
    private _frameCompleted = new LiteEvent<void>();

    /**
     * The virtual machine that hosts the device
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
        const keyboardInfo = this.hostVm.getDeviceInfo(DT_KEYBOARD);
        if (keyboardInfo && keyboardInfo.provider) {
           this._keyboardProvider = keyboardInfo.provider as IKeyboardProvider; 
        }
        this._keyboardProvider.setKeyStatusHandler((device, key, status) => {
            device.setStatus(key, status);
        });
    }

    /**
     * Initializes members
     */
    constructor() {
        super();
        this._lineStatus = [];
        for (let i = 0; i < 8; i++) {
            this._lineStatus[i] = 0x00;
        }
    }

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
    }

    /**
     * Allow the device to react to the completion of a frame
     */
    onFrameCompleted(): void {
        this.hostVm.keyboardProvider.emulateKeyStroke();
    }

    /**
     * Allow external entities respond to frame completion
     */
    get frameCompleted(): LiteEvent<void> {
        return this._frameCompleted;
    }

    /**
     * Sets the status of the specified Spectrum keyboard key
     * @param key Key code
     * @param isDown True, if the key is down; otherwise, false
     */
    setStatus(key: SpectrumKeyCode, isDown: boolean): void {
        const lineIndex = Math.floor(key / 5);
        const lineMask = 1 << (key % 5);
        this._lineStatus[lineIndex] = isDown
            ? (this._lineStatus[lineIndex] | lineMask) & 0xFF
            : (this._lineStatus[lineIndex] & ~lineMask) & 0xFF;
    }

    /**
     * Gets the status of the specified Spectrum keyboard key.
     * @param key Key code
     * @returns True, if the key is down; otherwise, false
     */
    getStatus(key: SpectrumKeyCode): boolean {
        const lineIndex = Math.floor(key / 5);
        const lineMask = 1 << (key % 5);
        return (this._lineStatus[lineIndex] & lineMask) !== 0;
    }

    /**
     * Gets the byte we would get when querying the I/O address with the
     * specified byte as the highest 8 bits of the address line
     * @param lines The highest 8 bits of the address line
     * @returns The status value to be received when querying the I/O
     */
    getLineStatus(lines: number): number {
        let status = 0;
        lines = (~lines) & 0xFF;

        let lineIndex = 0;
        while (lines > 0) {
            if ((lines & 0x01) !== 0) {
                status |= this._lineStatus[lineIndex];
            }
            lineIndex++;
            lines >>= 1;
        }
        return ~status & 0xFF;
    }

    /**
     * Resets the device
     */
    reset(): void {
        for (let i = 0; i < this._lineStatus.length; i++) {
            this._lineStatus[i] = 0;
        }
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
}
