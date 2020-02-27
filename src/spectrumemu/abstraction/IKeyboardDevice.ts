import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";
import { IFrameBoundDevice } from "./IFrameBoundDevice";
import { SpectrumKeyCode } from "../devices/keyboard/SpectrumKeyCode";

    /// <summary>
    /// This interface represents the Spectrum keyboard device
    /// </summary>
export interface IKeyboardDevice extends ISpectrumBoundDevice, IFrameBoundDevice {
    /**
     * Sets the status of the specified Spectrum keyboard key
     * @param key Key code
     * @param isDown True, if the key is down; otherwise, false
     */
    setStatus(key: SpectrumKeyCode, isDown: boolean): void;

    /**
     * Gets the status of the specified Spectrum keyboard key.
     * @param key Key code
     * @returns True, if the key is down; otherwise, false
     */
    getStatus(key: SpectrumKeyCode): boolean;

    /**
     * Gets the byte we would get when querying the I/O address with the
     * specified byte as the highest 8 bits of the address line
     * @param lines The highest 8 bits of the address line
     * @returns The status value to be received when querying the I/O
     */
    getLineStatus(lines: number): number;
}