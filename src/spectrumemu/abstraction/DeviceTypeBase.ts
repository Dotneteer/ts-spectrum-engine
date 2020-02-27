import { IDevice } from "./IDevice";

export abstract class DeviceTypeBase implements IDevice {
    /**
     * Device key information
     */
    abstract get key(): string;

    /**
     * Resets the device
     */
    abstract reset(): void;

    /**
     * Gets the current state of the device
     */
    abstract getDeviceState(): any;

    /**
     * Restores the state of the device from the specified object
     * @param state Device state
     */
    abstract restoreDeviceState(state: any): void;
}