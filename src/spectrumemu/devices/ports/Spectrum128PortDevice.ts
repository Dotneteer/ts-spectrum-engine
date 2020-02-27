import { UlaGenericPortDeviceBase } from "./UlaGenericPortDeviceBase";
import { Spectrum128MemoryPagePortHandler } from "./Spectrum128MemoryPagePortHandler";
import { ISoundDevice } from "../../abstraction/ISoundDevice";
import { Spectrum48PortHandler } from "./Spectrum48PortHandler";
import { SoundRegisterIndexPortHandler } from "./SoundRegisterIndexPortHandler";
import { SoundRegisterValuePortHandler } from "./SoundRegisterValuePortHandler";

/**
 * This class represents the port device used by the Spectrum 128 virtual machine
 */
export class Spectrum128PortDevice extends UlaGenericPortDeviceBase {
    private readonly _memoryHandler: Spectrum128MemoryPagePortHandler;

    /**
     * Indicates if paging is enabled or not.
     * Port 0x7FFD, Bit 5: 
     * False - paging is enables
     * True - paging is not enabled and further output to the port
     * is ignored until the computer is reset
     */
    pagingEnabled = true;

    constructor() {
        super();
        this.handlers.push(new Spectrum48PortHandler(this));
        this._memoryHandler = new Spectrum128MemoryPagePortHandler(this);
        this.handlers.push(this._memoryHandler);
        this.handlers.push(new SoundRegisterIndexPortHandler(this));
        this.handlers.push(new SoundRegisterValuePortHandler(this));
    }
}
