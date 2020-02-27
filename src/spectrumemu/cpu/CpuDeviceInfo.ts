import { DeviceInfoBase } from "../devices/DeviceInfoBase";
import { IZ80Cpu } from "../abstraction/IZ80Cpu";
import { ICpuConfiguration } from "../abstraction/ICpuConfiguration";
import { IVmComponentProvider } from "../abstraction/IVmComponentProvider";

/**
 * This class describes configuration information for the CPU device.
 */
export class CpuDeviceInfo extends DeviceInfoBase<IZ80Cpu, ICpuConfiguration, IVmComponentProvider> {
    constructor(configurationData: ICpuConfiguration) {
        super(undefined, configurationData);
    }
}