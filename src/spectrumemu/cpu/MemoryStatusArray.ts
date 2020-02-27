// --- This class represents a status array where every bit 
// --- indicates the status of a particular memory address
// --- within the 64K memory space
export class MemoryStatusArray {
    // --- Stores the array of bits, each number 32 bits
    private readonly _memoryBits: number[] = [];

    // --- Create an array of zero bits
    constructor() {
        this.clearAll();
    }

    // --- Clear all bits
    public clearAll() {
        for (var i = 0; i < 2048; i++) {
            this._memoryBits[i] = 0;
        }
    }

    // --- Clear a set of bits
    public clearSet(start: number, end: number): void {
        let startPos = start >> 5;
        let endPos = end >> 5;
        // --- Reset the start bits
        let firstBit = start % 32;
        let lastBit = startPos === endPos ? end % 32 : 31;
        let mask = 0x0;
        for (let i = firstBit; i <= lastBit; i++) {
            mask |= (0x01 << i);
        }
        mask = ~mask & 0xFFFF_FFFF;
        this._memoryBits[startPos] &= mask;
        if (startPos === endPos) {
            return;
        }

        // --- Reset the middle bits
        for (let i = startPos + 1; i <= endPos - 1; i++) {
            this._memoryBits[i] = 0;
        }

        // --- Reset the tail bits
        mask = 0;
        for (let i = 0; i <= end %32; i++) {
            mask |= (0x01 << i);
        }
        mask = ~mask & 0xFFFF_FFFF;
        this._memoryBits[endPos] &= mask;
    }


    // --- Gets the state of the specified bit
    public getBit(index: number) : boolean {
        index &= 0xFFFF;
        var position = index >> 5;
        var mask = 1 << (index % 32);
        return (this._memoryBits[position] & mask) !== 0;
    }

    // --- Sets the specified bit to true
    public touch(index: number) {
        index &= 0xFFFF;
        var position = index >> 5;
        var mask = 1 << (index % 32);
        this._memoryBits[position] |= mask; 
    }

    // --- Checks if all addresses are touched between the start and end
    public touchedAll(start: number, end: number) {
        start &= 0xFFFF;
        end &= 0xFFFF;
        for (var i = start; i <= end; i++) {
            if (!this.getBit(i)) {
                    return false;
            }
        }
        return true;
    }

    // --- Checks if all addresses are touched between the start and end
    public touchedAny(start: number, end: number) {
        start &= 0xFFFF;
        if (end > 0xFFFF) {
            end = 0xFFFF;
        }
        for (var i = start; i <= end; i++) {
            if (this.getBit(i)) {
                return true;
            }
        }
        return false;
    }
}