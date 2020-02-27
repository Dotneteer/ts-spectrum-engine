import { ScreenConfiguration } from "../spectrumemu/devices/screen/ScreenConfiguration";

/**
 * This message is sent from the backend to the UI with
 * the current screen, beeper, and sound configuration
 */
export interface IMachineConfigMessage {
  screenConfig: ScreenConfiguration;
  palette: number[];
  samplesPerFrame: number;
}