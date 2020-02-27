import { StackPointerManipulationEvent } from "../cpu/StackPointerManipulationEvent";
import { StackContentManipulationEvent } from "../cpu/StackContentManipulationEvent";

/**
 * This interface defines the operations that support debugging the call stack
 */
export interface IStackDebugSupport {
    /**
     * Records a stack pointer manipulation event
     * @param ev Event that manipulates SP
     */
    recordStackPointerManipulationEvent(ev: StackPointerManipulationEvent): void;

    /**
     * Records a stack content manipulation event
     * @param ev Event that manupulates the contents of the stack
     */
    recordStackContentManipulationEvent(ev: StackContentManipulationEvent): void;
}