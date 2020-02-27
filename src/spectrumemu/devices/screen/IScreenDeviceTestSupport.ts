/**
 * This interface defines the operations that support 
 * the testing of a screen device
 */
export interface IScreenDeviceTestSupport {
    /**
     * Fills the entire screen buffer with the specified data
     * @param data Data to fill the pixel buffer
     */
    fillScreenBuffer(data: number): void;
}