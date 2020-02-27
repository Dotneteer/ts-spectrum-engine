import { MemorySectionType } from "./MemorySectionType";

/**
 * This class describes a memory section with a start address and a length
 */
export class MemorySection {
    private _start = 0;
    private _end = 0;
    private _type = MemorySectionType.Disassemble;

    /**
    * The start address of the section
    */
    get startAddress() { return this._start; }
    set startAddress(value: number) { this._start = value & 0xffff; }

    /**
    * The end address of the section (inclusive)
    */
    get endAddress() { return this._end; }
    set endAddress(value: number) { this._end = value & 0xffff; }

    /**
    * The type of the memory section
    */
    get sectionType() { return this._type; }
    set sectionType(value: MemorySectionType) { this._type = value; }

    /**
    * The lenght of the memory section
    */
    get lenght(): number {
        return (this.endAddress - this.startAddress + 1) & 0xffff;
    } 

    /**
     * Creates a MemorySection with the specified properties
     * @param startAddress Starting address
     * @param endAddress Ending address (inclusive)
     * @param sectionType Section type
     */
    constructor(startAddress: number, endAddress: number, sectionType = MemorySectionType.Disassemble) {
        if (endAddress >= startAddress)  {
            this.startAddress = startAddress;
            this.endAddress = endAddress;
        } else {
            this.startAddress = endAddress;
            this.endAddress = startAddress;
        }
        this.sectionType = sectionType;
    }

    /**
     * Checks if this memory section overlaps with the othe one
     * @param other Other memory section
     * @return True, if the sections overlap
     */
    overlaps(other: MemorySection): boolean {
        return other._start >= this._start && other._start <= this._end 
            || other._end >= this._start && other._end <= this._end
            || this._start >= other._start && this._start <= other._end
            || this._end >= other._start && this._end <= other._end;
    }

    /**
     * Checks if this section has the same start and length than the other
     * @param other Other memory section
     * @return True, if the sections have the same start and length
     */
    sameSection(other: MemorySection): boolean {
        return this._start === other._start && this._end === other._end;
    }

    /**
     * Gets the intersection of the two memory sections
     * @param other Other memory section
     * @return Intersection, if exists; otherwise, undefined
     */
    intersect(other: MemorySection): MemorySection | undefined {
        let intStart = -1;
        let intEnd = -1;
        if (other._start >= this._start && other._start <= this._end) {
            intStart = other._start;
        }
        if (other._end >= this._start && other._end <= this._end) {
            intEnd = other._end;
        }
        if (this._start >= other._start && this._start <= other._end) {
            intStart = this._start;
        }
        if (this._end >= other._start && this._end <= other._end) {
            intEnd = this._end;
        }
        return intStart < 0 || intEnd < 0
                ? undefined
                : new MemorySection(intStart, intEnd);
    }

    /**
     * 
     * @param other Checks if this memory section equals with the other
     */
    equals(other: MemorySection): boolean {
        return this._start === other._start
            && this._end === other._end
            && this._type === other._type;
    }
}