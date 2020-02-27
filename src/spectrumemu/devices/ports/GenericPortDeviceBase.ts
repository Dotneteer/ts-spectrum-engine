import { PortDeviceType } from "./PortDeviceType";
import { IPortDevice } from "../../abstraction/IPortDevice";
import { IZ80Cpu } from "../../abstraction/IZ80Cpu";
import { IScreenDevice } from "../../abstraction/IScreenDevice";
import { IPortHandler } from "../../abstraction/IPortHandler";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { NoopZ80Cpu } from "../../cpu/NoopZ80Cpu";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";

/**
 * This class is intended to be the base class of port devices
 */
export abstract class GenericPortDeviceBase extends PortDeviceType implements IPortDevice {
    protected cpu: IZ80Cpu = new NoopZ80Cpu();
    protected screenDevice: IScreenDevice | undefined;

    /**
     * List of available handlers
     */
    readonly handlers: IPortHandler[] = [];

    /**
     * The virtual machine that hosts the device
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host Spectrum virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
        this.cpu = hostVm.cpu;
        this.screenDevice = hostVm.screenDevice;
        for (const handler of this.handlers) {
            handler.onAttachedToVm(hostVm);
            handler.reset();
        }
    }

    /**
     * Reads the port with the specified address
     * @param addr Port address
     * @returns Port value
     */
    readPort(addr: number): number {
        // --- Handle I/O contention
        this.contentionWait(addr);

        // --- Find and invoke the handler
        for (const handler of this.handlers) {
            if (!handler.canRead || (addr & handler.portMask) !== handler.port) {
                continue;
            }
            const readResult = handler.handleRead(addr);
            if (readResult.handled) {
                return readResult.readValue;
            }
        }
        return this.unhandledRead(addr);
    }

    /**
     * Sends a byte to the port with the specified address
     * @param addr Port address
     * @param data Data to write to the port
     */
    writePort(addr: number, data: number): void {
        // --- Handle I/O contention
        this.contentionWait(addr);

        // --- Find and invoke the handler
        var handled = false;
        for (const handler of this.handlers) {
            if (handler.canWrite && (addr & handler.portMask) === handler.port) {
                handler.handleWrite(addr, data);
                handled = true;
            }
        }
    }

    /**
     * Emulates I/O contention
     * @param addr Port address
     */
    contentionWait(addr: number): void {
        if (!this.screenDevice) {
            return;
        }
        var lowBit = (addr & 0x0001) !== 0;
        if ((addr & 0xc000) === 0x4000
            || (addr & 0xc000) === 0xC000 && this.isContendedBankPagedIn()) {
            if (lowBit) {
                // --- C:1 x 4 contention scheme
                this.cpu.delay(this.screenDevice.getContentionValue(this.hostVm.currentFrameTact));
                this.cpu.delay(1);
                this.cpu.delay(this.screenDevice.getContentionValue(this.hostVm.currentFrameTact));
                this.cpu.delay(1);
                this.cpu.delay(this.screenDevice.getContentionValue(this.hostVm.currentFrameTact));
                this.cpu.delay(1);
                this.cpu.delay(this.screenDevice.getContentionValue(this.hostVm.currentFrameTact));
                this.cpu.delay(1);
            } else {
                // --- C:1, C:3 contention scheme
                this.cpu.delay(this.screenDevice.getContentionValue(this.hostVm.currentFrameTact));
                this.cpu.delay(1);
                this.cpu.delay(this.screenDevice.getContentionValue(this.hostVm.currentFrameTact));
                this.cpu.delay(3);
            }
        } else {
            if (lowBit) {
                // --- N:4 contention scheme
                this.cpu.delay(4);
            } else {
                // --- N:1, C:3 contention scheme
                this.cpu.delay(1);
                this.cpu.delay(this.screenDevice.getContentionValue(this.hostVm.currentFrameTact));
                this.cpu.delay(3);
            }
        }
    }

    /**
     * Define the test whether a contended RAM is paged in for 0xC000-0xFFFF
     */
    isContendedBankPagedIn(): boolean {
        return false;
    }

    /**
     * Define how to handle an unattached port
     * @param addr Port address
     * @returns Port value for the unhandled port address
     */
    unhandledRead(addr: number): number {
        return 0xFF;
    }

    /**
     * Resets this device
     */
    reset(): void {
        for (const handler of this.handlers) {
            handler.reset();
        }
    }

    /**
     * Gets the current state of the device
     */
    getDeviceState(): any {
        return undefined;
    }

    /**
     * Restores the state of the device from the specified object
     * @param state Device state
     */
    restoreDeviceState(state: any): void {
    }
}