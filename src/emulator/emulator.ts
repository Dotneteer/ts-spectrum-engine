import { zxSpectrumMachine } from "./EmulatorMachine";
import { EmulatorToolViewModel } from "./EmulatorToolViewModel";
import { SpectrumMachine } from "../spectrumemu/machine/SpectrumMachine";
import { SpectrumColors } from "../spectrumemu/devices/screen/Spectrum48ScreenDevice";
import { VmState } from "../spectrumemu/machine/VmState";

let emulatorViewModel: EmulatorToolViewModel;
let spectrumMachine: SpectrumMachine = zxSpectrumMachine;

// ============================================================================
// --- Entry point
$(document).ready(async function() {
  // --- Access the VS Code API
  // --- Delegate the control to the view model
  emulatorViewModel = new EmulatorToolViewModel();
  emulatorViewModel.init();
  emulatorViewModel.setStatus("Emulator created");

  // --- Obtain the current machine state

  // --- Tell the audio sample rate to the backend
  const audioCtx = new AudioContext();
  const sampleRate = audioCtx.sampleRate;
  audioCtx.close();
  const spectrumVm = spectrumMachine.spectrumVm;
  spectrumVm.beeperDevice.overrideSampleRate(sampleRate);
  if (spectrumVm.soundDevice) {
    spectrumVm.soundDevice.overrideSampleRate(sampleRate);
  }

  // --- Obtain machine configuration
  const screenConfig = spectrumVm.screenConfiguration;
  const palette = SpectrumColors;
  const samplesPerFrame = spectrumVm.beeperDevice.samplesPerFrame;

  // --- Configure the machine accordingly
  emulatorViewModel.screenConfig = screenConfig;
  emulatorViewModel.emulatorPane.configureScreen({
      screenConfig,
      palette,
      samplesPerFrame
  });
  emulatorViewModel.setDisplayLayout();
  emulatorViewModel.emulatorPane.setAudioSamplesPerFrame(samplesPerFrame);

  // --- Set the initial machine state
  emulatorViewModel.onVmStateChanged({
      oldState: VmState.None,
      newState: VmState.None,
      isFirstPause: false,
      isFirstStart: false,
      justRestoredState: false
  })
});
