import { VmState } from "./VmState";

/**
 * This class represents the arguments of the event that signs that
 * the state of the virtual machine changes
 */
export class VmStateChangedArgs {
    /**
     * Initializes the event arguments
     * @param oldState Old virtual machine state 
     * @param newState New virtual machione state
     */
    constructor(public oldState: VmState, public newState: VmState) {
    }
}