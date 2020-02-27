import { SpectrumSpecificDisassemblyFlags } from "./SpectrumSpecificDisassemblyFlags";
import { MemorySectionData } from "./MemorySectionData";

/**
 * Helper class for JSON serizalization
 */
export class DisassemblyAnnotationData {
    labels: any;
    comments: any;
    prefixComments: any;
    literals: any;
    literalReplacements: any;
    memorySections: MemorySectionData[] = [];
    disassemblyFlags: SpectrumSpecificDisassemblyFlags = 0;
}