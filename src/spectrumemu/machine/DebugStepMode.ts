/**
 * The mode the execution cycle should run in debug mode
 */
export enum DebugStepMode {
    /**
     * Execution stops at the next breakpoint
     */
    StopAtBreakpoint,

    /**
     * Execution stops after the next instruction
     */
    StepInto,

    /**
     * Execution stops after the next instruction. If that should
     * be a subroutine call, the execution stops after returning
     * from the subroutine.
     */
    StepOver
}
