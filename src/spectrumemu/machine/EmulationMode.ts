/**
 * This enumeration defines how the spectrum emulation mode
 * should work
 */
export enum EmulationMode {
    /**
     * Run the virtual machine until stopped
     */
    Continuous,

    /**
     * Run the virtual machine in debugger mode
     */
    Debugger,

    /**
     * Run the VM until the CPU is halted
     */
    UntilHalt,

    /**
     * Run the CPU until the current ULA rendering frame ends
     * by the ULA clock
     */
    UntilFrameEnds,

    /**
     * Run the CPU until a specified value of the PC register is reached
     */
    UntilExecutionPoint
}