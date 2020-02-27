import { MemorySection } from "./MemorySection";
import { MemorySectionType } from "./MemorySectionType";

/**
 * This class implements a memory map of the ZX Spectrum virtual machine.
 * Internally, the sections of the memory map are kept ordered by the section's 
 * start addresses.
 */
export class MemoryMap {
    sections: MemorySection[] = [];

    /**
     * Gets the count of items in the memory map
     */
    get count() { return this.sections.length; }

    /**
     * Adds the specified item to the map
     * @param item Memory section item to add to the map
     */
    add(item: MemorySection): void {
        // --- We store the items of the list in ascending order by StartAddress
        let overlapFound: boolean;
        do {
            overlapFound = false;

            // --- Adjust all old sections that overlap with the new one
            for (let i = 0; i < this.sections.length; i++) {
                var oldSection = this.sections[i];
                if (item.overlaps(oldSection)) {
                    // --- The new item overlaps with one of the exisitning ones
                    overlapFound = true;
                    const oldStart = oldSection.startAddress;
                    const oldEndEx = oldSection.endAddress;
                    const newStart = item.startAddress;
                    const newEndEx = item.endAddress;

                    if (oldStart < newStart) {
                        // --- Adjust the length of the old section: 
                        // --- it gets shorter
                        oldSection.endAddress = newStart - 1;
                        if (oldEndEx > newEndEx) {
                            // --- The rightmost part of the old section becomes a new section
                            const newSection = new MemorySection(newEndEx + 1, oldEndEx);
                            this.sections.splice(i+1, 0, newSection);
                        }
                        break;
                    }

                    if (oldStart >= newStart) {
                        if (oldEndEx <= newEndEx) {
                            // --- The old section entirely intersects wiht the new section:
                            // --- Remove the old section
                            this.sections.splice(i, 1);
                        } else {
                            // --- Change the old sections's start address
                            oldSection.startAddress = newEndEx + 1;
                        }
                        break;
                    }
                }
            }
        } while (overlapFound);

        // --- At this point we do not have no old overlapping section anymore.
        // --- Insert the nex section to its place according to its StartAddress
        let insertPos = this.sections.length;
        for (var i = 0; i < this.sections.length; i++) {
            if (this.sections[i].startAddress > item.startAddress) {
                // --- This is the right place to insert the new section
                insertPos = i;
                break;
            }
        }
        this.sections.splice(insertPos, 0, item);
    }

    /**
     * Merges the sections of another map into this one
     * @param map Map to merge into this one
     * @param offset Optional offset of start and end addresses
     */
    merge(map: MemoryMap, offset: number = 0): void {
        if (!map) {
            return;
        }
        for (const section of map.sections) {
            this.add(new MemorySection(
                section.startAddress + offset,
                section.endAddress + offset,
                section.sectionType));
        }
    }

    /**
     * Joins adjacent Disassembly memory sections
     */
    normalize(): void {
        var changed = true;
        while (changed) {
            changed = false;
            for (var i = 1; i < this.count; i++) {
                const prevSection = this.sections[i - 1];
                const currentSection = this.sections[i];
                if (prevSection.endAddress !== currentSection.startAddress - 1 
                    || prevSection.sectionType !== MemorySectionType.Disassemble
                    || currentSection.sectionType !== MemorySectionType.Disassemble) {
                        continue;
                }

                prevSection.endAddress = currentSection.endAddress;
                this.sections.splice(i, 1);
                changed = true;
            }
        }
    }
}
