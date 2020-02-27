import { GenericPortDeviceBase } from "./GenericPortDeviceBase";
import { IMemoryDevice } from "../../abstraction/IMemoryDevice";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { ScreenRenderingPhase } from "../screen/ScreenRenderingPhase";

/**
 * This class implements a base class for port handling that implements the
 * "floating bus" feature of the ULA.
 * http://ramsoft.bbk.org.omegahg.com/floatingbus.html
 */
export class UlaGenericPortDeviceBase extends GenericPortDeviceBase {
    protected memoryDevice: IMemoryDevice | undefined;

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        super.onAttachedToVm(hostVm);
        this.memoryDevice = hostVm.memoryDevice;
    }

    /**
     * Define how to handle an unattached port
     * @param addr Port address
     * @returns Port value for the unhandled port address
     */
    unhandledRead(addr: number): number {
        if (!this.hostVm || !this.screenDevice || !this.memoryDevice) {
            return 0xFF;
        }
        const tact = this.hostVm.currentFrameTact % this.screenDevice.renderingTactTable.length;
        const rt = this.screenDevice.renderingTactTable[tact];
        let memAddr = 0;
        switch (rt.phase) {
            case ScreenRenderingPhase.BorderFetchPixel:
            case ScreenRenderingPhase.DisplayB1FetchB2:
            case ScreenRenderingPhase.DisplayB2FetchB1:
                memAddr = rt.pixelByteToFetchAddress;
                break;
            case ScreenRenderingPhase.BorderFetchPixelAttr:
            case ScreenRenderingPhase.DisplayB1FetchA2:
            case ScreenRenderingPhase.DisplayB2FetchA1:
                memAddr = rt.attributeToFetchAddress;
                break;
        }

        if (memAddr === 0) {
            return 0xFF;
        }
        return this.memoryDevice.read(memAddr, true);
    }
}