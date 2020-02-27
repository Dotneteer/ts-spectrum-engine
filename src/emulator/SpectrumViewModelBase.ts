import { VmState } from "../spectrumemu/machine/VmState";
import { IVmStateChangedMessage } from "./IVmStateShangedMessage";
import { IScreenRefreshedMessage } from "./IScreenRefreshedMessage";
import { zxSpectrumMachine } from "./EmulatorMachine";

/**
 * This class represents the base of all Spectrum-related view models
 */
export abstract class SpectrumViewModelBase {
  private _state = VmState.None;
  private _frameCount = 0;

  constructor() {
    // --- Set up the machine state change event
    zxSpectrumMachine.vmStateChanged.on(arg => {
      this.onVmStateChanged({
        oldState: arg.oldState,
        newState: arg.newState,
        isFirstStart: zxSpectrumMachine.isFirstStart,
        isFirstPause: zxSpectrumMachine.isFirstPause,
        justRestoredState: zxSpectrumMachine.justRestoredState
      });
    });

    // --- Set up screen refresh event
    zxSpectrumMachine.vmScreenRefreshed.on(() => this._onScreenRefresh());
  }

  /**
   * Gets the last known state of the associated virtual machine
   */
  get state(): VmState {
    return this._state;
  }

  /**
   * This member is called when it is time to init the
   * view model
   */
  init(): void {}

  /**
   * The screen has been resized. Allow the viewmodel to respond
   */
  onResize(): void {}

  /**
   * Override to handle the first start (from stopped state)
   * of the virtual machine
   */
  onFirstStart(): void {}

  /**
   * Override to handle the start of the virtual machine.
   * This method is called for the first start, too.
   */
  onStart(): void {}

  /**
   * Override to handle the paused state of the virtual machine.
   * This method is called for the first pause, too-
   */
  onPaused(): void {}

  /**
   * Override to handle the first paused state
   * of the virtual machine
   */
  onFirstPaused(): void {}

  /**
   * Override to handle the stopped state of the virtual machine.
   */
  onStopped(): void {}

  /**
   * Set the machine status when the screen has been refreshed.
   */
  onScreenRefreshed(args: IScreenRefreshedMessage): void {}

  /**
   * Set the machine status and notify controls
   * @param args State change event args
   */
  onVmStateChanged(args: IVmStateChangedMessage): void {
    // --- Anyhow, we always provide a way to respond for *any*
    // --- state changes
    const state = (this._state = args.newState);
    if (state === VmState.Running) {
      if (args.isFirstStart || args.justRestoredState) {
        this.onFirstStart();
      }
      this.onStart();
    } else if (state === VmState.Paused) {
      if (args.isFirstPause || args.justRestoredState) {
        this.onFirstPaused();
      }
      this.onPaused();
    } else if (state === VmState.Stopped) {
      this.onStopped();
    }
  }

  /**
   * Updates the view according to the current state of
   * the view model
   */
  updateView(): void {}

  /**
   * Sends refresh message to the WebView, provided it
   * exist
   */
  private _onScreenRefresh() {
    this._frameCount++;

    // --- Create screen contents
    const spectrumVm = zxSpectrumMachine.spectrumVm;
    const screenDevice = spectrumVm.screenDevice;
    const buffer = screenDevice.getPixelBuffer();

    // --- Send screen refresh information
    this.onScreenRefreshed({
      frame: this._frameCount,
      screenData: buffer,
      ts: new Date().getTime()
    });
  }
}
