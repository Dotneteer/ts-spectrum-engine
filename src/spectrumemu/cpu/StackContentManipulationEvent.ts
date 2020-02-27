// This class provides information about the manipulation of the stack's contents
// event
export class StackContentManipulationEvent {
    constructor(public operationAddress: number, 
        public operation: string, 
        public spValue: number, 
        public content: number | undefined, 
        public tacts: number) {
    }
}
