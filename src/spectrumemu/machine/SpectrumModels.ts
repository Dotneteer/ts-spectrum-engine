import { SpectrumModelEditions } from "./SpectrumModelEditions";
import { SpectrumEdition } from "./SpectrumEdition";
import { MemoryContentionType } from "../devices/memory/MemoryContentionType";

/**
 * Key for ZX Spectrum 48K
 */
export const ZX_SPECTRUM_48 = "ZX Spectrum 48K";

/**
 * Key for ZX Spectrum 128K
 */
export const ZX_SPECTRUM_128 = "ZX Spectrum 128K";

/**
 * Key for ZX Spectrum +3E
 */
export const ZX_SPECTRUM_P3_E = "ZX Spectrum +3E";

/**
 * Key for ZX Spectrum Next
 */
export const ZX_SPECTRUM_NEXT = "ZX Spectrum Next";

/**
 * Key for PAL revisions
 */
export const PAL = "PAL";

/**
 * Key for PAL revisions
 */
export const PAL2 = "PAL2";

/**
 * Key for NTSC revisions
 */
export const NTSC = "NTSC";

/**
 * Key for single floppy
 */
export const FLOPPY1 = "FLOPPY1";

/**
 * Key for double floppy
 */
export const FLOPPY2 = "FLOPPY2";

/**
 * The type of the Spectrum model
 */
export enum SpectrumModelType {
    Spectrum48,
    Spectrum128,
    SpectrumP3,
    Next
}

// --- Specifiy Spectrum editions
const models: any = { 
        "ZX Spectrum 48K": {
            "PAL": {
                cpu: {
                    baseClockFrequency: 3_500_000,
                    clockMultiplier: 1,
                    supportsNextOperations: false
                },
                rom: {
                    romName: "ZxSpectrum48",
                    numberOfRoms: 1,
                    spectrum48RomIndex: 0
                },
                memory: {
                    supportsBanking: false,
                    contentionType: MemoryContentionType.Ula
                },
                screen: {
                    interruptTact: 11,
                    verticalSyncLines: 8,
                    nonVisibleBorderTopLines: 8,
                    borderTopLines: 48,
                    borderBottomLines: 48,
                    nonVisibleBorderBottomLines: 8,
                    displayLines: 192,
                    borderLeftTime: 24,
                    borderRightTime: 24,
                    displayLineTime: 128,
                    horizontalBlankingTime: 40,
                    nonVisibleBorderRightTime: 8,
                    pixelDataPrefetchTime: 2,
                    attributeDataPrefetchTime: 1
                }
            },
            
            "PAL2": {
                ulaIssue: "2",
                cpu: {
                    baseClockFrequency: 3_500_000,
                    clockMultiplier: 1,
                    supportsNextOperations: false
                },
                rom: {
                    romName: "ZxSpectrum48",
                    numberOfRoms: 1,
                    spectrum48RomIndex: 0
                },
                memory: {
                    supportsBanking: false,
                    contentionType: MemoryContentionType.Ula
                },
                screen: {
                    interruptTact: 11,
                    verticalSyncLines: 8,
                    nonVisibleBorderTopLines: 8,
                    borderTopLines: 48,
                    borderBottomLines: 48,
                    nonVisibleBorderBottomLines: 8,
                    displayLines: 192,
                    borderLeftTime: 24,
                    borderRightTime: 24,
                    displayLineTime: 128,
                    horizontalBlankingTime: 40,
                    nonVisibleBorderRightTime: 8,
                    pixelDataPrefetchTime: 2,
                    attributeDataPrefetchTime: 1
                }
            },
            
            "NTSC": {
                cpu: {
                    baseClockFrequency: 3_500_000,
                    clockMultiplier: 1,
                    supportsNextOperations: false
                },
                rom: {
                    romName: "ZxSpectrum48",
                    numberOfRoms: 1,
                    spectrum48RomIndex: 0
                },
                memory: {
                    supportsBanking: false,
                    contentionType: MemoryContentionType.Ula
                },
                screen: {
                    interruptTact: 11,
                    verticalSyncLines: 8,
                    nonVisibleBorderTopLines: 16,
                    borderTopLines: 24,
                    borderBottomLines: 24,
                    nonVisibleBorderBottomLines: 0,
                    displayLines: 192,
                    borderLeftTime: 24,
                    borderRightTime: 24,
                    displayLineTime: 128,
                    horizontalBlankingTime: 40,
                    nonVisibleBorderRightTime: 8,
                    pixelDataPrefetchTime: 2,
                    attributeDataPrefetchTime: 1
                }
            }
        },

        "ZX Spectrum 128K": {
            "PAL": {
                cpu: {
                    baseClockFrequency: 3_546_900,
                    clockMultiplier: 1,
                    supportsNextOperations: false
                },
                rom: {
                    romName: "ZxSpectrum128",
                    numberOfRoms: 2,
                    spectrum48RomIndex: 1
                },
                memory: {
                    supportsBanking: true,
                    ramBanks: 8,
                    contentionType: MemoryContentionType.Ula
                },
                screen: {
                    interruptTact: 14,
                    verticalSyncLines: 8,
                    nonVisibleBorderTopLines: 7,
                    borderTopLines: 48,
                    borderBottomLines: 48,
                    nonVisibleBorderBottomLines: 8,
                    displayLines: 192,
                    borderLeftTime: 24,
                    borderRightTime: 24,
                    displayLineTime: 128,
                    horizontalBlankingTime: 40,
                    nonVisibleBorderRightTime: 12,
                    pixelDataPrefetchTime: 2,
                    attributeDataPrefetchTime: 1
                }
            }
        }
    };

/**
 * This class is an inventory of available Spectrum models and
 * revisions supported by SpectNetVsc
 */
class VmModels {
    private _stockModels = new Map<string, SpectrumModelEditions>();

    /**
     * Initializes the stock models
     */
    constructor() {
        // --- Go through all models
        for (let modelKey in models){
            const allConfig = models[modelKey];
            const modelEditions = new SpectrumModelEditions();
            for (let editionKey in allConfig) {
                const edConfig = allConfig[editionKey];

                const edition = new SpectrumEdition();
                if (edConfig.ulaIssue) {
                    edition.ulaIssue = edConfig.ulaIssue === "3" ? "3": "2";
                } else {
                    edition.ulaIssue = "3";
                }
                if (edConfig.cpu) {
                    edition.cpu.baseClockFrequency = edConfig.cpu.baseClockFrequency;
                    edition.cpu.clockMultiplier = edConfig.cpu.clockMultiplier;
                    edition.cpu.supportsNextOperations = edConfig.cpu.supportsNextOperations;
                }
                if (edConfig.rom) {
                    edition.rom.numberOfRoms = edConfig.rom.numberOfRoms;
                    edition.rom.romName = edConfig.rom.romName;
                    edition.rom.spectrum48RomIndex = edConfig.rom.spectrum48RomIndex;
                }
                if (edConfig.memory) {
                    edition.memory.contentionType = edConfig.memory.contentionType;
                    edition.memory.nextMemorySize = edConfig.memory.NextMemorySize;
                    edition.memory.ramBanks = edConfig.memory.ramBanks;
                    edition.memory.supportsBanking = edConfig.memory.supportsBanking;
                }
                if (edConfig.screen) {
                    edition.screen.attributeDataPrefetchTime = edConfig.screen.attributeDataPrefetchTime;
                    edition.screen.borderBottomLines = edConfig.screen.borderBottomLines;
                    edition.screen.borderLeftTime = edConfig.screen.borderLeftTime;
                    edition.screen.borderRightTime = edConfig.screen.borderRightTime;
                    edition.screen.borderTopLines = edConfig.screen.borderBottomLines;
                    edition.screen.displayLines = edConfig.screen.displayLines;
                    edition.screen.displayLineTime = edConfig.screen.displayLineTime;
                    edition.screen.horizontalBlankingTime = edConfig.screen.horizontalBlankingTime;
                    edition.screen.interruptTact = edConfig.screen.interruptTact;
                    edition.screen.nonVisibleBorderBottomLines = edConfig.screen.nonVisibleBorderBottomLines;
                    edition.screen.nonVisibleBorderRightTime = edConfig.screen.nonVisibleBorderRightTime;
                    edition.screen.nonVisibleBorderTopLines = edConfig.screen.nonVisibleBorderTopLines;
                    edition.screen.pixelDataPrefetchTime = edConfig.screen.pixelDataPrefetchTime;
                    edition.screen.verticalSyncLines = edConfig.screen.verticalSyncLines;
                }
                if (edConfig.floppy) {
                    edition.floppy.driveBPresent = edConfig.floppy.DriveBPresent;
                    edition.floppy.floppyPresent = edConfig.floppy.FloppyPresent;
                }

                modelEditions.set(editionKey, edition);
            }
            this._stockModels.set(modelKey, modelEditions);
        }
    }

    /**
     * Gets all stock models
     */
    get stockModels(): Map<string, SpectrumModelEditions> {
        return this._stockModels;
    }

    /**
     * Gets the specified model edition
     * @param modelKey Spectrum model key
     * @param editionKey Spectrum edition key
     */
    getEdition(modelKey: string, editionKey: string) {
        const modelEditions = this._stockModels.get(modelKey);
        return modelEditions 
            ? modelEditions.editions.get(editionKey)
            : undefined;
    }

    /**
     * Gets the configuration of ZX Spectrum 48K PAL edition
     */
    get spectrum48Pal(): SpectrumEdition {
        const edition = this.getEdition(ZX_SPECTRUM_48, PAL);
        if (edition) {
            return edition;
        }
        throw new Error("Spectrum 48 PAL edition specification cannot be found");
    }

    /**
     * Gets the configuration of ZX Spectrum 48K NTSC edition
     */
    get spectrum48Ntsc(): SpectrumEdition {
        const edition = this.getEdition(ZX_SPECTRUM_48, NTSC);
        if (edition) {
            return edition;
        }
        throw new Error("Spectrum 48 NTSC edition specification cannot be found");
    }

    /**
     * Gets the configuration of ZX Spectrum 128K PAL edition
     */
    get spectrum128Pal(): SpectrumEdition {
        const edition = this.getEdition(ZX_SPECTRUM_128, PAL);
        if (edition) {
            return edition;
        }
        throw new Error("Spectrum 128 PAL edition specification cannot be found");
    }
}

export const SpectrumModels = new VmModels();
