import { UlaGenericPortDeviceBase } from "./UlaGenericPortDeviceBase";
import { Spectrum48PortHandler } from "./Spectrum48PortHandler";

/**
 * This class represents the port device used by the Spectrum 48 virtual machine
 */
export class Spectrum48PortDevice extends UlaGenericPortDeviceBase {
    constructor() {
        super();
        const handler = new Spectrum48PortHandler(this);
        this.handlers.push(handler);
    }
}