import { IVmComponentProvider } from "./IVmComponentProvider";
import { SpectrumKeyCode } from "../devices/keyboard/SpectrumKeyCode";
import { EmulatedKeyStroke } from "../devices/keyboard/EmulatedKeyStroke";
import { IKeyEventInfo } from "../devices/keyboard/IKeyEventInfo";
import { IKeyboardDevice } from "./IKeyboardDevice";

/**
 * Defines the operations a keyboard provider should implement so that
 * it can represent the Spectrum VM's keyboard
 */
export interface IKeyboardProvider extends IVmComponentProvider {
    /**
     * Sets the method that can handle the status change of a Spectrum keyboard key
     * @param statusHandler Key status handler method
     * The first argument of the handler method is the Spectrum key code. The
     * second argument indicates if the specified key is down (true) or up (false)
     */
    setKeyStatusHandler(statusHandler: (device: IKeyboardDevice, key: SpectrumKeyCode, status: boolean) => void): void;

    /**
     * Indicates if physical keyboard is allowed
     */
    allowPhysicalKeys: boolean;

    /**
     * Process the info when a key is down
     * @param keyInfo Key information
     */
    keydown(keyInfo: IKeyEventInfo): void;

    /**
     * Process the info when a key is up
     * @param keyInfo Key information
     */
    keyup(keyInfo: IKeyEventInfo): void;

    /**
     * Emulates queued key strokes as if those were pressed by the user
     * @returns True, if any key stroke has been emulated; otherwise, false
     */
    emulateKeyStroke(): boolean;

    /**
     * Adds an emulated keypress to the queue of the provider.
     * @param keypress Keystroke information
     * The provider can play back emulated key strokes
     */
    queueKeyPress(keypress: EmulatedKeyStroke): void;

    /**
     * The provider can set its keyboard mappings from configuration.
     * In case of invalid configuration, the provider uses the default mappings.
     */
    setMappings(): void;
}