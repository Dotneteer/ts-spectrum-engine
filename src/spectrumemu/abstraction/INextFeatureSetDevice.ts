import { ISpectrumBoundDevice } from "./ISpectrumBoundDevice";
import { ITbBlueControlDevice } from "./ITbBlueControlDevice";

/**
 * Represents a device that implements the Spectrum Next feature set
 * virtual machine
 */
export interface INextFeatureSetDevice extends ISpectrumBoundDevice, ITbBlueControlDevice {
    /**
     * Gets the value of the register specified by the latest
     * SetRegisterIndex call.
     * If the specified register is not supported, returns 0xFF
     */
    getRegisterValue(): number;

    /**
     * Synchronizes a 16K slot with 8K slots
     * @param slotNo16K Index of 16K slot
     * @param bankNo16K 16K bank to page in
     */
    sync16KSlot(slotNo16K: number, bankNo16K: number): void;
}