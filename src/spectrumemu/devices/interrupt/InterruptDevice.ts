import { IInterruptDevice } from "../../abstraction/IInterruptDevice";
import { IZ80Cpu } from "../../abstraction/IZ80Cpu";
import { ISpectrumVm } from "../../abstraction/ISpectrumVm";
import { Z80StateFlags } from "../../cpu/Z80StateFlags";
import { InterruptDeviceType } from "./InterruptDeviceType";
import { NoopSpectrumVm } from "../../machine/NoopSpectrumVm";
import { NoopZ80Cpu } from "../../cpu/NoopZ80Cpu";
import { LiteEvent } from "../../utils/LiteEvent";

/**
 * Represents the longest instruction tact count
 */
const LONGEST_OP_TACTS = 23;

/**
 * This device is responsible to raise a maskable interrupt in every screen
 *rendering frame, according to Spectrum specification
 */
export class InterruptDevice extends InterruptDeviceType implements IInterruptDevice {
    private _cpu: IZ80Cpu = new NoopZ80Cpu();
    private _frameCompleted = new LiteEvent<void>();

    /**
     * The virtual machine that hosts the device
     */
    hostVm: ISpectrumVm = new NoopSpectrumVm();

    /**
     * Signs that the device has been attached to the Spectrum virtual machine
     * @param hostVm Host virtual machine
     */
    onAttachedToVm(hostVm: ISpectrumVm): void {
        this.hostVm = hostVm;
        this._cpu = hostVm.cpu;
        this.reset();
    }

    /**
     * The ULA tact to raise the interrupt at
     */
    readonly interruptTact: number;

    /**
     * Signs that an interrupt has been raised in this frame.
     */
    interruptRaised: boolean = false;

    /**
     * Signs that the interrupt signal has been revoked
     */
    interruptRevoked: boolean = false;

        /// <summary>
        /// Initializes a new instance of the <see cref="T:System.Object" /> class.
        /// </summary>
    constructor(interruptTact: number) {
        super();
        this.interruptTact = interruptTact;
    }

    /**
     * Resets the device.
     * You should reset the device in each screen frame to raise an
     * interrupt at the next frame.
     */
    reset(): void {
        this.interruptRaised = false;
        this.interruptRevoked = false;
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

    /**
     * Generates an interrupt in the current phase, if time has come.
     * @param currentTact Current frame tact
     */
    checkForInterrupt(currentTact: number): void {
        if (this.interruptRevoked) {
            // --- We fully handled the interrupt in this frame
            return;
        }

        if (currentTact < this.interruptTact) {
            // --- The interrupt should not be raised yet
            return;
        }

        if (currentTact > this.interruptTact + LONGEST_OP_TACTS) {
            // --- Let's revoke the INT signal independently whether the CPU
            // --- caught it or not
            this.interruptRevoked = true;
            this._cpu.stateFlags &= Z80StateFlags.InvInt;
            return;
        }

        if (this.interruptRaised) {
            // --- The interrupt is raised, not revoked, but the CPU has not handled it yet
            return;
        }

        // --- Do not raise the interrupt when the CPU blocks it
        if (this._cpu.isInterruptBlocked) {
            return;
        }
         
        // --- It's time to raise the interrupt
        this.interruptRaised = true;
        this._cpu.stateFlags |= Z80StateFlags.Int;
        this.frameCount++;
    }

    /**
     * #of frames rendered
     */
    frameCount: number = 0;

    /**
     * Overflow from the previous frame, given in #of tacts 
     */
    overflow: number = 0;

    /**
     * Allow the device to react to the start of a new frame
     */
    onNewFrame(): void {
        this.interruptRaised = false;
        this.interruptRevoked = false;
    }

    /**
     * Allow the device to react to the completion of a frame
     */
    onFrameCompleted(): void {
    }

    /**
     * Allow external entities respond to frame completion
     */
    get frameCompleted(): LiteEvent<void> {
        return this._frameCompleted;
    }
}