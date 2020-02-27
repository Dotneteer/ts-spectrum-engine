import { VmState } from "spectrumemu/machine/VmState";

/**
 * This message is sent from the backend to the UI when
 * the state of the virtual machine changes
 */
export interface IVmStateChangedMessage {
  oldState: VmState;
  newState: VmState;
  isFirstStart: boolean;
  isFirstPause: boolean;
  justRestoredState: boolean;
}
