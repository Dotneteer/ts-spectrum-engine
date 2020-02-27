// Operation Prefix Mode
export enum OpPrefixMode {
    // No operation prefix
    None = 0,

    // Extended mode (0xED prefix)
    Extended,

    // Bit operations mode (0xCB prefix)
    Bit
}
