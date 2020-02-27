// Represents set masks for each Z80 flags
export enum FlagsResetMask
{
    S = 0x7F,
    Z = 0xBF,
    R5 = 0xDF,
    H = 0xEF,
    R3 = 0xF7,
    PV = 0xFB,
    N = 0xFD,
    C = 0xFE
}