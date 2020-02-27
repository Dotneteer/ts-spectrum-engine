// This class provides information about a stack pointer manipulation
// event
export class StackPointerManipulationEvent
{
    constructor(public operationAddress: number, 
        public operation: string,
        public oldValue: number, 
        public newValue: number, 
        public tacts: number) {
    }
}