// Represents the event args of a Z80 operation
export class Z80InstructionExecutionArgs {
    constructor(public pcBefore: number, 
        public instruction: number[], 
        public opCode: number, 
        public pcAfter?: number) {
    }
}
