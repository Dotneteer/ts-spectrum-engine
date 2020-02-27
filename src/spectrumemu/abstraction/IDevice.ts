/**
 * Represents an abstract device
 */
export interface IDevice {
    /**
     * Device key information
     */
    readonly key: string;

    /**
     * Resets the device
     */
    reset(): void;

    /**
     * Gets the current state of the device
     */
    getDeviceState(): any;

    /**
     * Restores the state of the device from the specified object
     * @param state Device state
     */
    restoreDeviceState(state: any): void;
}