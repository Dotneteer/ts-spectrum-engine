import {
  BUTTON_IDS,
  DIS_BUTTON_IDS,
  ALL_BUTTON_IDS,
  START,
  PAUSE,
  STOP,
  RESTART,
  LOAD_MODE,
  PACMAN,
  JETSET,
  TEST_IT
} from "./UiConstants";
import { ChildViewModelBase } from "./ChildViewModelBase";
import { EmulatorToolViewModel } from "./EmulatorToolViewModel";
import { VmState } from "../spectrumemu/machine/VmState";
import { IVmStateChangedMessage } from "./IVmStateShangedMessage";
import { ExecuteCycleOptions } from "../spectrumemu/machine/ExecuteCycleOptions";
import { EmulationMode } from "../spectrumemu/machine/EmulationMode";
import { defaultSpectNetConfig } from "../config/SpectNetConfig";
import { zxSpectrumMachine } from "./EmulatorMachine";
import { delay } from "../spectrumemu/utils/AsyncUtils";
import { SpectrumKeyCode } from "../spectrumemu/devices/keyboard/SpectrumKeyCode";
import { EmulatedKeyStroke } from "../spectrumemu/devices/keyboard/EmulatedKeyStroke";

const TOOLBAR = "#toolbar";

/**
 * Represents the view model that handles the tool bar
 */
export class ToolbarViewModel extends ChildViewModelBase<
  EmulatorToolViewModel
> {
  private _anyButtonDown = false;
  private _lastState: VmState;

  /**
   * Instantiates the view model
   * @param {EmulatorToolViewModel} parent Parent view model
   */
  constructor(parent: EmulatorToolViewModel) {
    super(parent);
  }

  /**
   * Gets the ID of the pane
   */
  get paneId(): string {
    return TOOLBAR;
  }

  /**
   * This member is called when it is time to init the
   * view model
   */
  init(): void {
    this._initButtonEvents();
    this._updateVmControlButtons(VmState.None);
    this.gotFocus.on(() => {
      this.parent.setFocus(this.parent.emulatorPane);
    });
  }

  /**
   * Set the machine status and notify controls
   * @param args State change event args
   */
  onVmStateChanged(args: IVmStateChangedMessage): void {
    super.onVmStateChanged(args);
    this._lastState = args.newState;
    this._updateVmControlButtons(args.newState);
  }

  /**
   * Initializes the tooltips of toolbar buttons
   */
  private _initButtonEvents() {
    const self = this;
    const parent = this.parent;
    const emulatorPane = parent.emulatorPane;

    // --- Set up tooltips
    $(BUTTON_IDS).addClass("tooltip");
    $(DIS_BUTTON_IDS).addClass("tooltip");

    // --- These events manage tooltips
    $(`${ALL_BUTTON_IDS}`)
      .mouseover(function(e) {
        $(this)
          .find(".tooltiptext")
          .css("visibility", "visible")
          .css("opacity", "1");
      })
      .mouseleave(function(e) {
        $(this)
          .find(".tooltiptext")
          .css("visibility", "hidden")
          .css("opacity", "0");
      })
      .click(function(e) {
        $(this)
          .find(".tooltiptext")
          .css("visibility", "hidden")
          .css("opacity", "0");
      });

    // --- These events handle the mouse click events so that
    // --- the button-down state can be visualized
    $(BUTTON_IDS)
      .mousedown(function(e) {
        if (e.button === 0) {
          $(this).addClass("down-button");
          self._anyButtonDown = true;
        }
      })
      .mouseup(function(e) {
        if (self._anyButtonDown) {
          $(BUTTON_IDS).removeClass("down-button");
          self._anyButtonDown = false;
        }
      });

    $("body").mouseleave(e => {
      $(BUTTON_IDS).removeClass("down-button");
      self._anyButtonDown = false;
    });

    // --- These events handle mouse click events of buttons
    $(START).click(() => {
      this._startMachine();
      emulatorPane.provideAudio();
    });
    $(PAUSE).click(async () => {
      emulatorPane.suspendAudio();
      await zxSpectrumMachine.pause();
    });
    $(STOP).click(async () => {
      emulatorPane.closeAudio();
      await zxSpectrumMachine.stop();
    });
    $(RESTART).click(async () => {
      emulatorPane.closeAudio();
      await zxSpectrumMachine.stop();
      this._startMachine();
      emulatorPane.provideAudio();
    });

    // --- Tape-related buttons
    $(LOAD_MODE).click(() => {
      if (
        this._lastState !== VmState.None &&
        this._lastState !== VmState.Stopped
      ) {
        return;
      }

      const fastMode = (defaultSpectNetConfig.fastLoad = !defaultSpectNetConfig.fastLoad);
      if (fastMode) {
        $(LOAD_MODE).text("Fast Load");
      } else {
        $(LOAD_MODE).text("Slow Load");
      }
    });
    $(PACMAN).click(() => {
      defaultSpectNetConfig.defaultTape = "pac-man";
      $(PACMAN).addClass("hilited");
      $(JETSET).removeClass("hilited");
    });
    $(JETSET).click(() => {
      defaultSpectNetConfig.defaultTape = "jet-set-willy";
      $(JETSET).addClass("hilited");
      $(PACMAN).removeClass("hilited");
    });

    // --- Automatic test button
    $(TEST_IT).click(async () => {
      // --- Turn on FAST load mode
      defaultSpectNetConfig.fastLoad = true;
      $(LOAD_MODE).text("Fast Load");

      // --- Restart the machine
      emulatorPane.closeAudio();
      await zxSpectrumMachine.stop();
      this._startMachine();
      emulatorPane.provideAudio();
      await delay(5000);

      // --- Emulate key presses
      this._queueKeyStroke(3, SpectrumKeyCode.J);
      await delay(400);
      this._queueKeyStroke(3, SpectrumKeyCode.P, SpectrumKeyCode.SShift);
      await delay(400);
      this._queueKeyStroke(3, SpectrumKeyCode.P, SpectrumKeyCode.SShift);
      await delay(400);
      this._queueKeyStroke(3, SpectrumKeyCode.Enter);

      // --- Load the game and allow it to run
      await delay(30000);

      // --- Pause the game
      emulatorPane.suspendAudio();
      await zxSpectrumMachine.pause();
    });
  }

  /**
   * Updates emulator panel button states
   * @param vmstate The new state to update buttons to
   */
  private _updateVmControlButtons(vmstate: VmState): void {
    const none = vmstate === VmState.None;
    const running = vmstate === VmState.Running;
    const paused = vmstate === VmState.Paused;
    const stopped = vmstate === VmState.Stopped;
    this._showButton(START, none || paused || stopped);
    this._showButton(PAUSE, running);
    this._showButton(STOP, running || paused);
    this._showButton(RESTART, running || paused);
    this._enableButton(LOAD_MODE, none || stopped);
  }

  /**
   * Shows or hides the button according to the specified predicate
   * @param id Button ID
   * @param pred Predicate
   */
  private _showButton(id: string, pred: boolean): void {
    const disId = `${id}-disabled`;
    if (pred) {
      $(id).show();
      $(disId).hide();
    } else {
      $(id).hide();
      $(disId).show();
    }
  }

  /**
   * Shows or hides the button according to the specified predicate
   * @param id Button ID
   * @param pred Predicate
   */
  private _enableButton(id: string, pred: boolean): void {
    if (pred) {
      $(id).removeClass("disabled");
    } else {
      $(id).addClass("disabled");
    }
  }

  /**
   * Starts the virtual machine with the standard options
   */
  private _startMachine() {
    const config = defaultSpectNetConfig;
    const options = new ExecuteCycleOptions(
      EmulationMode.UntilFrameEnds,
      undefined,
      config.fastLoad
    );
    zxSpectrumMachine.start(options);
  }

  private _queueKeyStroke(
    time: number,
    primaryCode: SpectrumKeyCode,
    secondaryCode: SpectrumKeyCode = null
  ): void {
    const spectrumVm = zxSpectrumMachine.spectrumVm;

    var currentTact = spectrumVm.cpu.tacts;
    var lastTact =
      currentTact + spectrumVm.frameTacts * time * spectrumVm.clockMultiplier;

    spectrumVm.keyboardProvider.queueKeyPress(
      new EmulatedKeyStroke(currentTact, lastTact, primaryCode, secondaryCode)
    );
  }
}
