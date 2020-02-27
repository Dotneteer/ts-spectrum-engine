import { ToolbarViewModel } from "./ToolbarViewModel";
import { EMULATOR_COLUMN, 
    SHADOW_SCREEN, 
    SCREEN } from "./UiConstants";
import { EmulatorPaneViewModel } from "./EmulatorPaneViewModel";
import { ContainerViewModelBase } from "./ContainerViewModelBase";
import { VmState } from "../spectrumemu/machine/VmState";
import { IScreenConfigurationEx } from "../spectrumemu/abstraction/IScreenConfigurationEx";
import { IVmStateChangedMessage } from "./IVmStateShangedMessage";
import { IScreenRefreshedMessage } from "./IScreenRefreshedMessage";
import { zxSpectrumMachine } from "./EmulatorMachine";

/**
 * This class represents the view model of the entire emulator page
 */
export class EmulatorToolViewModel extends ContainerViewModelBase {
    // --- Toolbar information
    private _lastVmState = VmState.None;
    private _sumProcessingTime: number;
    private _frames: number;

    // --- Screen information
    private _screenConfig: IScreenConfigurationEx | undefined;

    // --- Child view model information
    private _toolbar: ToolbarViewModel;
    private _emulatorPane: EmulatorPaneViewModel;

    // --- Other UI information
    private _statusPanel: JQuery<HTMLElement> | undefined;

    /**
     * Instantiates the view model
     * @param _messenger Messenger instance to send messages to the backend
     */
    constructor() {
        super();
        this._toolbar = new ToolbarViewModel(this);
        this._emulatorPane = new EmulatorPaneViewModel(this);
    }

    /**
     * Retrieves the toolbar pane
     */
    get toolbarPane() : ToolbarViewModel {
        return this._toolbar;
    }

    /**
     * Retrieves the emulator pane
     */
    get emulatorPane(): EmulatorPaneViewModel {
        return this._emulatorPane;
    }

    /**
     * Retrieves the screen configuration
     */
    get screenConfig(): IScreenConfigurationEx | undefined {
        return this._screenConfig;
    }
    set screenConfig(value: IScreenConfigurationEx | undefined) {
        this._screenConfig = value;
    }



    /**
     * Gets the last known state of the virtual machine
     */
    get lastVmState(): VmState {
        return this._lastVmState;
    }

    /**
     * Initializes the view model
     */
    init(): void {
        // --- Init local controls
        this._statusPanel = $("#emulator-status");

        // --- Complete the initialization
        this.setDisplayLayout();
        this._initializeUiEventHandlers();

        // --- Init child view models
        this.forEachChild(child => child.init());
    }

    /**
     * Writes the specified info into the status panel
     * @param info Info to write into the status panel
     */
    setStatus(info: string) {
        if (this._statusPanel) {
            this._statusPanel.text(info);
        }
    }

    /**
     * Set the machine status and notify controls
     * @param args State change event args
     */
    onVmStateChanged(args: IVmStateChangedMessage): void {
        this._lastVmState = args.newState;
        super.onVmStateChanged(args);
        if (args.isFirstStart) {
            this._frames = 0;
            this._sumProcessingTime = 0.0;
        }
        this.forEachChild(child => child.onVmStateChanged(args));
    }

    /**
     * Set the machine status when the screen has been refreshed.
     */
    onScreenRefreshed(args: IScreenRefreshedMessage): void {
        super.onScreenRefreshed(args);
        this._frames++;
        this._sumProcessingTime += zxSpectrumMachine.lastFrameProcessingTime;
        this.setStatus(`Frames: ${args.frame}, Processing Time: ${zxSpectrumMachine.lastFrameProcessingTime} ms, Avg: ${this._sumProcessingTime/this._frames}`);
        this.forEachChild(async child => await child.onScreenRefreshed(args));
    }

    /**
     * Adjusts control properties to the current screen size
     */
    setDisplayLayout() {
        // --- Set the dimensions of the shadow screen
        if (!this._screenConfig) {
            return;
        }

        const screenWidth = this._screenConfig.screenWidth;
        const screenHeight = this._screenConfig.screenLines;
        const shadowCanvas = $(SHADOW_SCREEN)[0] as HTMLCanvasElement;
        $(SHADOW_SCREEN).width(screenWidth).height(screenHeight);
        const shadowCtx = shadowCanvas.getContext("2d");
        if (shadowCtx) {
            shadowCtx.canvas.width = screenWidth;
            shadowCtx.canvas.height = screenHeight;
        }
    
        // --- Set the dimensions of the physical screen
        const zoomFactor = 2;
        const canvasWidth = screenWidth * zoomFactor;
        const canvasHeight = screenHeight * zoomFactor;
        const canvas = $(SCREEN)[0] as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.canvas.width = canvasWidth;
            ctx.canvas.height = canvasHeight;
        }
        $(EMULATOR_COLUMN).width(canvasWidth);
    }

    /**
     * Provides event handlers for events raised at the front end
     */
    _initializeUiEventHandlers() {
        // --- Recalculate the layout whenewer the screen size changes
        $(window).resize(() => {
            this.setDisplayLayout();
            this.forEachChild(child => child.onResize());
        });

        // --- These events forward key states to the
        // --- emulator or the focused panel
        $("body").keydown(e => {
            const target = this.focusedChild || this.emulatorPane;
            target.onKeydown(e);
        });
        $("body").keyup(e => {
            const target = this.focusedChild || this.emulatorPane;
            target.onKeyup(e);
        });
        $("body").keypress(e => {
            const target = this.focusedChild || this.emulatorPane;
            target.onKeypress(e);
        });
    }
}