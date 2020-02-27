// This enum represents the Z80 signals the CPU can receive
export enum Z80StateFlags {
    // No signal is set
    None = 0,

    // Indicates if an interrupt signal arrived
    Int = 0x01,

    // Indicates if a Non-Maskable Interrupt signal arrived
    Nmi = 0x02,

    // Indicates if a RESET signal arrived
    Reset = 0x04,

    // Is the CPU in HALTED state?
    Halted = 0x08,

    // Reset mask of INT
    InvInt = 0xFF - Int,

    // Reset mask for NMI
    InvNmi = 0xFF - Nmi,

    // Reset mask for RESET
    InvReset = 0xFF - Reset,

    // Reset mask for HALT
    InvHalted = 0xFF - Halted
}
