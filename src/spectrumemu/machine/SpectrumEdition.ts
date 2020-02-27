import { CpuConfigurationData } from "../cpu/CpuConfigurationData";
import { RomConfigurationData } from "../devices/rom/RomConfigurationData";
import { MemoryConfigurationData } from "../devices/memory/MemoryConfigurationData";
import { ScreenConfigurationData } from "../devices/screen/ScreenConfigurationData";
import { FloppyConfigurationData } from "../devices/floppy/FloppyConfigurationData";

/**
 * This class describes a revison of a particular Spectrum model
 */
export class SpectrumEdition {
    /**
     * The CPU configuration data for this revision
     */
    cpu = new CpuConfigurationData();

    /**
     * The ROM configuration data for this revision
     */
    rom = new RomConfigurationData();

    /**
     * The RAM memory configuration data for this revision
     */
    memory = new MemoryConfigurationData();

    /**
     * The screen configuration data for this revision
     */
    screen = new ScreenConfigurationData();

    /**
     * The floppy configuration of this revision
     */
    floppy = new FloppyConfigurationData();
        
            /// <summary>
        /// ULA Issue #
        /// </summary>
    ulaIssue = "3";
        

    /**
     * Returns a clone of this revision
     */
    clone(): SpectrumEdition {
        const ed = new SpectrumEdition();
        ed.cpu = this.cpu.clone();
        ed.rom = this.rom.clone();
        ed.memory = this.memory.clone();
        ed.screen = this.screen.Clone();
        ed.floppy = this.floppy.clone();
        ed.ulaIssue = this.ulaIssue;
        return ed;
    }
}