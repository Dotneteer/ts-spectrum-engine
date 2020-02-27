import { EmulatorToolViewModel } from "./EmulatorToolViewModel";
import { OVERLAY_TEXT, SHADOW_SCREEN, SCREEN } from "./UiConstants";
import { AudioRenderer } from "./AudioRenderer";
import { ChildViewModelBase } from "./ChildViewModelBase";
import { VmState } from "../spectrumemu/machine/VmState";
import { IAudioSamplesMessage } from "./IAudioSamplesMessage";
import { IMachineConfigMessage } from "./IMachineConfigMessage";
import { IVmStateChangedMessage } from "./IVmStateShangedMessage";
import { IScreenRefreshedMessage } from "./IScreenRefreshedMessage";
import { zxSpectrumMachine } from "./EmulatorMachine";

const EMULATOR_BODY = "#emulator-screen";

/**
 * This class represents the view model for the Spectum Emulator
 */
export class EmulatorPaneViewModel extends ChildViewModelBase<
  EmulatorToolViewModel
> {
  // --- Screen rendering information
  private _palette: number[] = [];
  private _imageBuffer = new ArrayBuffer(0);
  private _imageBuffer8 = new Uint8Array(0);
  private _pixelData = new Uint32Array(0);
  private _intervalHandle: any = null;

  // --- Audio rendering information
  private _beeperRenderer: AudioRenderer | undefined;
  private _soundRenderer: AudioRenderer | undefined;
  private _audioSamplesPerFrame = 0;

  /**
   * Instantiates the view model
   * @param {EmulatorToolViewModel} _parent Parent view model
   */
  constructor(parent: EmulatorToolViewModel) {
    super(parent);

    // --- Handle beeper samples
    zxSpectrumMachine.vmBeeperSamplesEmitted.on(samples => {
      if (samples) {
        this.storeBeeperSamples(samples);
      }
    });
  }

  /**
   * Gets the ID of the pane
   */
  get paneId(): string {
    return EMULATOR_BODY;
  }

  /**
   * This member is called when it is time to init the
   * view model
   */
  init(): void {
    super.init();

    this.gotFocus.on(() => {
      this._setKeyboardOverlayState(true);
    });

    this.lostFocus.on(() => {
      this._setKeyboardOverlayState(false);
    });
  }

  /**
   * Handle the key down event
   * @param e Event arguments
   */
  onKeydown(e: JQuery.Event): void {
    zxSpectrumMachine.spectrumVm.keyboardProvider.keydown({
      keyCode: e.keyCode,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey
    });
  }

  /**
   * Handle the key up event
   * @param e Event arguments
   */
  onKeyup(e: JQuery.Event): void {
    zxSpectrumMachine.spectrumVm.keyboardProvider.keyup({
      keyCode: e.keyCode,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey
    });
  }

  /**
   * Sets the samples per frame value
   * @param samplesPerFrame Samples in a screen rendering frame
   */
  setAudioSamplesPerFrame(samplesPerFrame: number) {
    this._audioSamplesPerFrame = samplesPerFrame;
  }

  /**
   * Stores the beeper samples
   * @param message Audio samples
   */
  storeBeeperSamples(samples: number[]): void {
    if (this._beeperRenderer) {
      this._beeperRenderer.storeSamples(samples);
    }
  }

  /**
   * Configures the screen
   * @param message Configuration message
   */
  configureScreen(message: IMachineConfigMessage) {
    if (!this.parent || !this.parent.screenConfig) {
      return;
    }
    this._palette = message.palette.slice(0);
    const dataLen =
      this.parent.screenConfig.screenLines *
      this.parent.screenConfig.screenWidth *
      4;
    this._imageBuffer = new ArrayBuffer(dataLen);
    this._imageBuffer8 = new Uint8Array(this._imageBuffer);
    this._pixelData = new Uint32Array(this._imageBuffer);
  }

  /**
   * Turns on audio
   */
  provideAudio() {
    if (!this._beeperRenderer) {
      this._beeperRenderer = new AudioRenderer(this._audioSamplesPerFrame);
    }
    this._beeperRenderer.resumeAudio();
    if (!this._soundRenderer) {
      this._soundRenderer = new AudioRenderer(this._audioSamplesPerFrame);
    }
    this._soundRenderer.resumeAudio();
  }

  /**
   * Suspends audio
   */
  suspendAudio() {
    if (this._beeperRenderer) {
      this._beeperRenderer.suspendAudio();
    }
    if (this._soundRenderer) {
      this._soundRenderer.suspendAudio();
    }
  }

  /**
   * Resumes audio
   */
  resumeAudio() {
    if (this._beeperRenderer) {
      this._beeperRenderer.resumeAudio();
    }
    if (this._soundRenderer) {
      this._soundRenderer.resumeAudio();
    }
  }

  /**
   * Closes audio
   */
  closeAudio() {
    if (this._beeperRenderer) {
      this._beeperRenderer.closeAudio();
      this._beeperRenderer = undefined;
    }
    if (this._soundRenderer) {
      this._soundRenderer.closeAudio();
      this._soundRenderer = undefined;
    }
  }

  /**
   * Set the machine status and notify controls
   * @param args State change event args
   */
  onVmStateChanged(args: IVmStateChangedMessage): void {
    super.onVmStateChanged(args);
    let showOff = false;
    this._setOverlayState();

    if (args.newState === VmState.Running) {
      this.suspendAudio();
      this.resumeAudio();
    } else if (args.newState === VmState.Paused) {
      setTimeout(() => this.suspendAudio(), 20);
    } else if (
      args.newState === VmState.None ||
      args.newState === VmState.Stopped
    ) {
      showOff = true;
    }

    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = null;
    }
    if (showOff) {
      this._intervalHandle = setInterval(() => {
        this._fillShowOffDisplayData();
      }, 20);
    }
  }

  /**
   * Set the machine status when the screen has been refreshed.
   */
  onScreenRefreshed(args: IScreenRefreshedMessage): void {
    super.onScreenRefreshed(args);
    this._displayScreenData(args.screenData);
  }

  /**
   * Sets the state of the emulator overlay text
   */
  private _setOverlayState(): void {
    const s = this.parent.lastVmState;
    $(OVERLAY_TEXT).css(
      "display",
      s === VmState.None || s === VmState.Paused || s === VmState.Stopped
        ? "inline-block"
        : "none"
    );
    $(OVERLAY_TEXT).text(
      s === 0 ? "Not started yet" : s === 3 ? "Paused" : "Stopped"
    );
  }

  /**
   * Sets the overlay according to the keyboard state
   * @param attached True, if the keyboard is attached to the emulator
   */
  private _setKeyboardOverlayState(attached: boolean): void {
    if (this.parent.lastVmState !== VmState.Running) {
      return;
    }
    $(OVERLAY_TEXT).css("display", attached ? "none" : "inline-block");
    $(OVERLAY_TEXT).text(attached ? "" : "Keyboard detached");
  }

  /**
   * Displays the screen data send in the input string
   * @param screenData Screen data (hex coded)
   */
  private _displayScreenData(
    screenData: Uint8Array,
    fillerAction: (data: Uint32Array) => void = undefined
  ): void {
    const shadowCanvas = $(SHADOW_SCREEN)[0] as HTMLCanvasElement;
    if (!shadowCanvas) return;
    
    const shadowCtx = shadowCanvas.getContext("2d");
    if (!shadowCtx) {
      return;
    }
    const shadowImageData = shadowCtx.getImageData(
      0,
      0,
      shadowCanvas.width,
      shadowCanvas.height
    );
    const canvas = $(SCREEN)[0] as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const pixelData = this._pixelData;
    const palette = this._palette;
    if (!canvas || !shadowImageData || !this.parent.screenConfig) {
      return;
    }
    let j = 0;

    if (fillerAction) {
      fillerAction(pixelData);
    } else {
      for (let i = 0; i < screenData.length; i++) {
        let code = screenData[i];
        pixelData[j++] = palette[code & 0x0f];
      }
    }
    shadowImageData.data.set(this._imageBuffer8);
    shadowCtx.putImageData(shadowImageData, 0, 0);
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(shadowCanvas, 0, 0, canvas.width, canvas.height);
    }
  }

  private _fillNoise(pixelData: Uint32Array): void {
    for (let i = 0; i < pixelData.length; i++) {
      const rndNum = (Math.floor(Math.random() * 128) + 64) & 0xff;
      const value = 0xff000000 | (rndNum << 16) | (rndNum << 8) | rndNum;
      pixelData[i] = value;
    }
  }

  private _fillShowOffDisplayData(): void {
    this._displayScreenData(null, this._fillNoise);
  }
}
