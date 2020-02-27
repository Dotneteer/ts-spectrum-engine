// This class provides information about a branching event
export class BranchEvent {
    constructor(public OperationAddress: number, 
        public operation: string, 
        public jumpAddress: number, 
        public tacts: number) {
    }
}