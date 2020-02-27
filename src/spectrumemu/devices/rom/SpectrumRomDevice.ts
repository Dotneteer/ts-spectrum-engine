import { RomDeviceType } from "./RomDeviceType";
import { IRomDevice } from "../../abstraction/IRomDevice";
import { IRomProvider } from "../../abstraction/IRomProvider";
import { IRomConfiguration } from "../../abstraction/IRomConfiguration";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { RomConfigurationData } from "./RomConfigurationData";
import { NoopRomProvider } from "./NoopRomProvider";
import { DT_ROM } from "../DeviceTypes";
import { DisassemblyAnnotation } from "./DisassemblyAnnotation";

/**
 * The address to terminate the data block load when the header is invalid
 */
export const LOAD_BYTES_INVALID_HEADER_ADDRESS = "$LoadBytesInvalidHeaderAddress";

/**
 * The address of the main execution cycle.
 */
export const MAIN_EXEC_ADDRESS = "$MainExecAddress";

/**
 * The address to resume after a hooked LOAD_BYTES operation
 */
export const LOAD_BYTES_RESUME_ADDRESS = "$LoadBytesResumeAddress";
        
/**
 * The LOAD_BYTES routine address in the ROM
 */
export const LOAD_BYTES_ROUTINE_ADDRESS = "$LoadBytesRoutineAddress";

/**
 * The SAVE_BYTES routine address in the ROM
 */
export const SAVE_BYTES_ROUTINE_ADDRESS = "$SaveBytesRoutineAddress";
        
/**
 * The start address of the token table
 */
export const TOKEN_TABLE_ADDRESS = "$TokenTableAddress";

/**
 * The number of token in the token table
 */
export const TOKEN_COUNT = "$TokenCount";

/**
 * The token table property key
 */
export const TOKEN_TABLE_KEY = "TokenTable";

/**
 * Get the offset of tokens in BASIC listings
 */
export const TOKEN_OFFSET = "$TokenOffset";

/**
 * This class implements the ROM device for all ZX Spectrum models
 */
export class SpectrumRomDevice extends RomDeviceType implements IRomDevice {
    private _romProvider: IRomProvider = new NoopRomProvider();
    private _romConfiguration: IRomConfiguration = new RomConfigurationData();
    private readonly _knownAddresses: Map<string, number> = new Map<string, number>();
    private readonly _properties: Map<string, any> = new Map<string, any>();
    private _romBytes: Uint8Array[] = [];
    private _romAnnotations: DisassemblyAnnotation[] = [];

    /**
     * The virtual machine that hosts the device
     */
    public hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostvm Host virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
        const romInfo = hostVm.getDeviceInfo(DT_ROM);
        if (romInfo) {
            this._romProvider = romInfo.provider as IRomProvider;
            this._romConfiguration = romInfo.configurationData as IRomConfiguration;
        }

        // --- Init the ROM contents and ROM annotations
        var roms = this._romConfiguration.numberOfRoms;
        if (roms > 16) {
            roms = 16;
        }
        this._romBytes = [];
        this._romAnnotations = [];
        if (roms === 1) {
            this._romBytes[0] = this._romProvider.loadRomBytes(this._romConfiguration.romName, -1);
            const annData = DisassemblyAnnotation.deserialize(
                this._romProvider.loadRomAnnotations(this._romConfiguration.romName, -1));
            if (annData) {
                this._romAnnotations[0] = annData;
            }
        } else {
            for (var i = 0; i < roms; i++) {
                this._romBytes[i] = this._romProvider.loadRomBytes(this._romConfiguration.romName, i);
                const annData = DisassemblyAnnotation.deserialize(
                    this._romProvider.loadRomAnnotations(this._romConfiguration.romName, i));
                if (annData) {
                    this._romAnnotations[i] = annData;
                }
            }
        }

        this.processRoms(this._romBytes, this._romAnnotations);
    }

    /**
     * Override this method to define how to process the ROM contents
     * @param romBytes ROM contents
     * @param romAnnotations ROM annotations
     */
    processRoms(romBytes: Uint8Array[], romAnnotations: DisassemblyAnnotation[]): void {
        this._knownAddresses.clear();
        this._properties.clear();
        this.processSpectrum48Props(romBytes, romAnnotations);
    }

    /**
     * 
     * @param annotation Gets the value of the specified literal
     * @param key Literal key
     */
    private getLiteralValue(annotation: DisassemblyAnnotation, key: string): number | undefined {
        for (const literal of annotation.literals) {
            if (literal[1].indexOf(key) >= 0) {
                return literal[0];
            }
        }
        return undefined;
    }

    /**
     * Process the specified ROM page as a Spectrum48 ROM page
     * @param romBytes Contents of the ROMs
     * @param romAnnotations ROM annotations
     */
    processSpectrum48Props(romBytes: Uint8Array[], romAnnotations: DisassemblyAnnotation[]): void {
        const romPage = this._romConfiguration.spectrum48RomIndex;
        const annotations = romAnnotations[romPage];
        const known = this._knownAddresses;

        // --- Get SAVE/LOAD vectors
        let addr = this.getLiteralValue(annotations, LOAD_BYTES_INVALID_HEADER_ADDRESS);
        if (addr) {
            known.set(`${LOAD_BYTES_INVALID_HEADER_ADDRESS}|${romPage}`, addr);    
        }
        addr = this.getLiteralValue(annotations, MAIN_EXEC_ADDRESS);
        if (addr) {
            known.set(`${MAIN_EXEC_ADDRESS}|${romPage}`, addr);    
        }
        addr = this.getLiteralValue(annotations, LOAD_BYTES_RESUME_ADDRESS);
        if (addr) {
            known.set(`${LOAD_BYTES_RESUME_ADDRESS}|${romPage}`, addr);    
        }
        addr = this.getLiteralValue(annotations, LOAD_BYTES_ROUTINE_ADDRESS);
        if (addr) {
            known.set(`${LOAD_BYTES_ROUTINE_ADDRESS}|${romPage}`, addr);    
        }
        addr = this.getLiteralValue(annotations, SAVE_BYTES_ROUTINE_ADDRESS);
        if (addr) {
            known.set(`${SAVE_BYTES_ROUTINE_ADDRESS}|${romPage}`, addr);    
        }
        let tokenTableAddress = this.getLiteralValue(annotations, TOKEN_TABLE_ADDRESS);
        if (tokenTableAddress) {
            known.set(`${TOKEN_TABLE_ADDRESS}|${romPage}`, tokenTableAddress);    
        }
        let tokenCount = this.getLiteralValue(annotations, TOKEN_TABLE_ADDRESS);
        if (tokenCount) {
            known.set(`${TOKEN_TABLE_ADDRESS}|${romPage}`, tokenCount);    
        }
        let tokenOffset = this.getLiteralValue(annotations, TOKEN_OFFSET);
        if (tokenOffset) {
            known.set(`${TOKEN_OFFSET}|${romPage}`, tokenOffset);    
        }

        const rom = romBytes[romPage];
        const tokenTable: string[] = [];
        this._properties.set(`${TOKEN_TABLE_ADDRESS}|${romPage}`, tokenTable);
        let tokenPtr = tokenTableAddress;
        if (!tokenPtr || !tokenCount) {
            return;
        }
        tokenPtr++;
        let token = "";
        while (tokenCount> 0) {
            const nextChar = rom[tokenPtr++];
            if ((nextChar & 0x80) > 0) {
                token += String.fromCharCode(nextChar & 0x7F);
                tokenTable.push(token);
                tokenCount--;
                token = "";
            } else {
                token += String.fromCharCode(nextChar);
            }
        }
    }

    /**
     * Resets this device
     */
    reset(): void {
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
     * Gets the binary contents of the ROM
     * @param romIndex Index of the ROM, by default, 0
     * @return Byte array that represents the ROM bytes
     */
    getRomBytes(romIndex: number): Uint8Array {
        return this._romBytes[romIndex];
    }

    /**
     * Gets a known address of a particular ROM
     * @param key Known address key
     * @param romIndex Index of the ROM, by default, 0
     * @returns Address, if found; otherwise, null
     */
    getKnownAddress(key: string, romIndex: number): number | undefined {
        return this._knownAddresses.get(`${key}|${romIndex}`);
    }
        
    /**
     * Gets a property of the ROM (depends on virtual machine model)
     * @param key Property key
     * @param romIndex Property value if found
     * @return Property value if found
     */
    getProperty<TProp>(key: string, romIndex: number): { found: boolean, value: TProp | undefined; } {
        let storedValue = this._properties.get(`${key}|${romIndex}`);
        return storedValue
            ? { found: true, value: storedValue as TProp}
            : { found: false, value: undefined };
    }
}