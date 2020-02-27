// Signs if the current instruction uses any of the indexed address modes
export enum OpIndexMode {
    // Indexed address mode is not used</summary>
    None = 0,

    // <summary>Indexed address with IX register</summary>
    IX,

    // <summary>Indexed address with IY register</summary>
    IY
}