import { SpectrumKeyCode } from "./SpectrumKeyCode";

/**
 * This class represents the information about an emulated key press 
 */
export class EmulatedKeyStroke {
    /**
     * Initializes a new instance
     * @param startTact Start CPU tact
     * @param endTact End CPU tact
     * @param primaryCode The primary key's code
     * @param secondaryCode The secondary key's code
     */
    constructor(public startTact: number, 
        public endTact: number, 
        public primaryCode: SpectrumKeyCode, 
        public secondaryCode?: SpectrumKeyCode) {
    }
}