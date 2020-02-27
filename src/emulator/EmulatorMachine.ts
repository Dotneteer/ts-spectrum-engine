import { SpectrumMachine } from "../spectrumemu/machine/SpectrumMachine";
import { PT_ROM, PT_KEYBOARD, PT_TAPE, PT_DEBUGINFO } from "../spectrumemu/devices/DeviceTypes";
import { SpectrumRomProvider } from "../spectrumemu/devices/rom/SpectrumRomProvider";
import { KeyboardProvider } from "../spectrumemu/devices/keyboard/KeyboardProvider";
import { TapeProvider } from "../spectrumemu/devices/tape/TapeProvider";
import { SpectrumDebugInfoProvider } from "../spectrumemu/machine/SpectrumDebugInfoProvider";

SpectrumMachine.registerProvider(PT_ROM, () => new SpectrumRomProvider());        
SpectrumMachine.registerProvider(PT_KEYBOARD, () => new KeyboardProvider());        
SpectrumMachine.registerProvider(PT_TAPE, () => new TapeProvider());     
SpectrumMachine.registerProvider(PT_DEBUGINFO, () => new SpectrumDebugInfoProvider()); 

export const zxSpectrumMachine = SpectrumMachine.createMachine("ZX Spectrum 48K", "PAL");
