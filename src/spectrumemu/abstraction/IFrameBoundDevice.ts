import { IDevice } from './IDevice';
import { LiteEvent } from '../utils/LiteEvent';

/**
 * This device is bound to a rendering frame of the Spectrum virtual machine
 */
export interface IFrameBoundDevice extends IDevice {
    /**
     * #of frames rendered
     */
    readonly frameCount: number;

    /**
     * Overflow from the previous frame, given in #of tacts 
     */
    overflow: number;

    /**
     * Allow the device to react to the start of a new frame
     */
    onNewFrame(): void;

    /**
     * Allow the device to react to the completion of a frame
     */
    onFrameCompleted(): void;

    /**
     * Allow external entities respond to frame completion
     */
    readonly frameCompleted: LiteEvent<void>;
}
