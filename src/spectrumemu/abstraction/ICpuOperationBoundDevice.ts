import { IDevice } from "./IDevice";

/**
 * This device is bound to the CPU operation of the virtual machine
 */
export interface ICpuOperationBoundDevice extends IDevice {
    /**
     * Allow the device to react to the start of a new frame
     */
    onCpuOperationCompleted(): void;
}