import * as path from 'path';

import { ITapeProvider } from "../../abstraction/ITapeProvider";
import { BinaryReader } from "../../utils/BinaryReader";
import { ITapeDataSerialization } from "./ITapeDataSerialization";
import { ISpectrumVm } from '../../abstraction/ISpectrumVm';
import { NoopSpectrumVm } from '../../machine/NoopSpectrumVm';
import { defaultSpectNetConfig } from "../../../config/SpectNetConfig";
import { zxSpectrumTapeSets } from './TapeSets';

/**
 * Implements the default tape provider
 */
export class TapeProvider implements ITapeProvider {
    /**
     * The component provider should be able to reset itself
     */
    reset(): void {

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
    }

    /**
     * Gets a binary reader that provides tape content
     */
    getTapeContent(): BinaryReader {
        // --- Check the current configuration for default file
        const config = defaultSpectNetConfig
        var buffer = new Buffer(zxSpectrumTapeSets[config.defaultTape]);
        return new BinaryReader(buffer);
    }

    /**
     * Creates a tape file with the specified name
     */
    createTapeFile(): void {
        // TODO: Implement this method
    }

    /**
     * This method sets the name of the file according to the 
     * Spectrum SAVE HEADER information
     * @param name Filename
     */
    setName(name: string): void {
        // TODO: Implement this method
    }

    /**
     * Appends the TZX block to the tape file
     * @param block Block to append
     */
    saveTapeBlock(block: ITapeDataSerialization): void {
        // TODO: Implement this method
    }

    /**
     * The tape provider can finalize the tape when all 
     * Blocks are written out.
     */
    finalizeTapeFile(): void {
        // TODO: Implement this method
    }
}