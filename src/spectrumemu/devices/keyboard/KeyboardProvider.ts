import { IKeyboardProvider } from "../../abstraction/IKeyboardProvider";
import { SpectrumKeyCode } from "./SpectrumKeyCode";
import { IKeyEventInfo } from "./IKeyEventInfo";
import { EmulatedKeyStroke } from "./EmulatedKeyStroke";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { KeyCode } from "./KeyCode";
import { KeyMapping, DefaultKeyMapping, PcKeyNames, SpectrumKeyNames } from "./KeyMapping";
import { IKeyboardDevice } from "../../abstraction/IKeyboardDevice";
import { isUndefined } from "util";
import { defaultSpectNetConfig } from "../../../config/SpectNetConfig";

/**
 * This class implements the provider that allows handling the keyboard
 */
export class KeyboardProvider implements IKeyboardProvider {
    private _statusHandler: ((device: IKeyboardDevice, key: SpectrumKeyCode, status: boolean) => void) | undefined;
    private _emulatedKeyStrokes: EmulatedKeyStroke[] = [];
    private _mappings = new Map<KeyCode, KeyMapping>();

    /**
     * The component provider should be able to reset itself
     */
    reset(): void {
        this._emulatedKeyStrokes = [];
    }

    /**
     * The virtual machine that hosts the provider
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * Signs that the provider has been attached to the Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
        this._mappings.clear();
        this._resetKeyMappings();
    }

    /**
     * Sets the method that can handle the status change of a Spectrum keyboard key
     * @param statusHandler Key status handler method
     * The first argument of the handler method is the Spectrum key code. The
     * second argument indicates if the specified key is down (true) or up (false)
     */
    setKeyStatusHandler(statusHandler: (device: IKeyboardDevice, key: SpectrumKeyCode, status: boolean) => void): void {
        this._statusHandler = statusHandler;
    }

    /**
     * Indicates if physical keyboard is allowed
     */
    allowPhysicalKeys = true;

    /**
     * Process the info when a key is down
     * @param keyInfo Key information
     */
    keydown(keyInfo: IKeyEventInfo): void {
        this._handleKey(keyInfo, true);
    }

    /**
     * Process the info when a key is up
     * @param keyInfo Key information
     */
    keyup(keyInfo: IKeyEventInfo): void {
        this._handleKey(keyInfo, false);
    }

    /**
     * Emulates queued key strokes as if those were pressed by the user
     * @returns True, if any key stroke has been emulated; otherwise, false
     */
    emulateKeyStroke(): boolean {
        // --- Exit, if Spectrum virtual machine is not available
        const spectrumVm = this.hostVm;
        if (!spectrumVm || !this._statusHandler) {
            return false;
        }

        const currentTact = spectrumVm.cpu.tacts;

        // --- Exit, if no keystroke to emulate
        if (this._emulatedKeyStrokes.length === 0) {
            return false;
        }

        // --- Check the next keystroke
        const keyStroke = this._emulatedKeyStrokes[0];

        // --- Time has not come
        if (keyStroke.startTact > currentTact) {
            return false;
        }

        if (keyStroke.endTact < currentTact) {
            // --- End emulation of this very keystroke
            this._statusHandler(this.hostVm.keyboardDevice, keyStroke.primaryCode, false);
            if (keyStroke.secondaryCode) {
                this._statusHandler(this.hostVm.keyboardDevice, keyStroke.secondaryCode, false);
            }
            this._emulatedKeyStrokes.pop();
            
            // --- We emulated the release
            return true;
        }

        // --- Emulate this very keystroke, and leave it in the queue
        this._statusHandler(this.hostVm.keyboardDevice, keyStroke.primaryCode, true);
        if (keyStroke.secondaryCode) {
            this._statusHandler(this.hostVm.keyboardDevice, keyStroke.secondaryCode, true);
        }
        return true;
    }

    /**
     * Adds an emulated keypress to the queue of the provider.
     * @param keypress Keystroke information
     * The provider can play back emulated key strokes
     */
    queueKeyPress(keypress: EmulatedKeyStroke): void {
        if (this._emulatedKeyStrokes.length === 0) {
            this._emulatedKeyStrokes.unshift(keypress);
            return;
        }

        var last = this._emulatedKeyStrokes[0];
        if (last.primaryCode === keypress.primaryCode
            && last.secondaryCode === keypress.secondaryCode) {
            // --- The same key has been clicked
            if (keypress.startTact >= last.startTact && keypress.startTact <= last.endTact) {
                // --- Old and new click ranges overlap, lengthen the old click
                last.endTact = keypress.endTact;
                return;
            }
        }
        this._emulatedKeyStrokes.unshift(keypress);
    }

    /**
     * The provider can set its keyboard mappings from configuration.
     * In case of invalid configuration, the provider uses the default mappings.
     */
    setMappings(): void {
        try {
            var config = defaultSpectNetConfig;
            if (!config.keymappings) {
                // --- No key mappings defined
                return;
            }

            // --- Clone all default mappings
            const mappings = new Map<KeyCode, KeyMapping>();
            for (const defMapping of DefaultKeyMapping) {
                mappings.set(defMapping.key, defMapping);
            }

            // --- Iterate through key mappings in the confiduration
            for (const keyIndex in config.keymappings) {
                const pcKey = PcKeyNames.get(keyIndex);
                if (!pcKey) {
                    continue;
                }

                // --- Get primary Spectrum key
                let primary: string | undefined;
                let secondary: string | undefined;
                const mapping = config.keymappings[keyIndex];
                if (typeof mapping === "string") {
                    primary = mapping;
                } else {
                    if (mapping.length > 0) {
                        primary = mapping[0];
                    }
                    if (mapping.length > 1) {
                        secondary = mapping[1];
                    }
                }
                if (!primary) {
                    continue;
                }
                const primaryKey = SpectrumKeyNames.get(primary);
                if (isUndefined(primaryKey)) {
                    continue;
                }

                // --- Get secondary Spectrum key
                const secondaryKey = secondary 
                    ? SpectrumKeyNames.get(secondary) 
                    : undefined;
                
                mappings.set(pcKey, new KeyMapping(pcKey, primaryKey, secondaryKey));
            }
            
            // --- Done, all mappings read
            this._mappings = mappings;
        }
        catch {
            this._resetKeyMappings();
        }
    }

    /**
     * Resets key mappings to default
     */
    private _resetKeyMappings(): void {
        for (const mapping of DefaultKeyMapping) {
            this._mappings.set(mapping.key, mapping);
        }
    }

    /**
     * Handles the key of a pressed/released key
     * @param keyInfo Key information
     * @param state True: pressed; False: released
     */
    private _handleKey(keyInfo: IKeyEventInfo, state: boolean) {
        if (!this.allowPhysicalKeys || !this._statusHandler) {
            return;
        }

        var mapping = this._mappings.get(keyInfo.keyCode || 0);
        if (mapping) {
            this._statusHandler(this.hostVm.keyboardDevice, mapping.zxPrimary, state);
            if (mapping.zxSecondary) {
                this._statusHandler(this.hostVm.keyboardDevice, mapping.zxSecondary, state);
            }
        }
    }
}