// Represents set masks for each Z80 flags
export enum FlagsSetMask
{
    S = 0x80,
    Z = 0x40,
    R5 = 0x20,
    H = 0x10,
    R3 = 0x08,
    PV = 0x04,
    N = 0x02,
    C = 0x01,
    SZPV = S | Z | PV,
    NH = N | H,
    R3R5 = R3 | R5
}