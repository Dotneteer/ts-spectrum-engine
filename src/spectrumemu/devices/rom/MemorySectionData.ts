import { MemorySectionType } from "./MemorySectionType";

/**
 * Stores serialization data for a memory section
 */
export class MemorySectionData {
    constructor (public startAddress: number, public endAddress: number, public sectionType: MemorySectionType) {
    }
}