import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";

    /// <summary>
    /// This interface represents the DivIDE device
    /// </summary>
export interface IDivIdeDevice extends ISpectrumBoundDevice {
    /**
     * The CONMEM bit of the controller
     */
    readonly conMem: boolean;

    /**
     * The MAPRAM bit of the controller
     */
    readonly mapRam: boolean;

    /**
     * The selected bank (0..3)
     */
    readonly bank: number;

    /**
     * Sets the divide control register
     * @param value Control register value
     */
    setControlRegister(value: number): void;
}