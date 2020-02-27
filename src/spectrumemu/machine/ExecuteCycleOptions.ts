import { EmulationMode } from "./EmulationMode";
import { DebugStepMode } from "./DebugStepMode";

/**
 * This class provides options for the ExecuteCycle function.
 */
export class ExecuteCycleOptions {
    /**
     * The emulation mode to use
     */
    readonly emulationMode: EmulationMode;

    /**
     * The debug mode to use
     */
    readonly debugStepMode: DebugStepMode;

    /**
     * Indicates if fast tape mode is allowed
     */
    readonly fastTapeMode: boolean;

    /**
     * The index of the ROM when a termination point is defined
     */
    readonly terminationRom: number;

    /**
     * The value of the PC register to reach when EmulationMode is
     * set to UntilExecutionPoint
     */
    readonly terminationPoint: number;

    /**
     * This flag shows that the virtual machine should run in hidden mode
     * (no screen, no sound, no delays)
     */
    readonly fastVmMode: boolean;

    /**
     * This flag shows whether the virtual machine should render the screen.
     * True, renders the screen; false, does not render the screen.
     * This flag overrides the FastVmMode setting.
     */
    readonly disableScreenRendering: boolean;

        /// <summary>
        /// Timeout in CPU tacts
        /// </summary>
    readonly timeoutTacts: number;

    /**
     * Initializes the options
     * @param emulationMode Execution emulation mode
     * @param debugStepMode Debugging execution mode
     * @param fastTapeMode Fast tape mode
     * @param terminationRom ROM index of the termination point
     * @param terminationPoint Termination point to reach
     * @param skipInterruptRoutine Signs if maskable interrupt routine instructions should be skipped
     * @param fastVmMode The VM should run in hidden mode
     * @param timeoutTacts Run timeout in CPU tacts
     * @param disableScreenRendering Screen rendering mode
     */
    constructor(emulationMode = EmulationMode.Continuous, 
        debugStepMode = DebugStepMode.StopAtBreakpoint, 
        fastTapeMode = false,
        terminationRom = 0x0000,
        terminationPoint = 0x0000,
        fastVmMode = false,
        timeoutTacts = 0,
        disableScreenRendering = false) {
        this.emulationMode = emulationMode;
        this.debugStepMode = debugStepMode;
        this.fastTapeMode = fastTapeMode;
        this.terminationRom = terminationRom;
        this.terminationPoint = terminationPoint;
        this.fastVmMode = fastVmMode;
        this.timeoutTacts = timeoutTacts;
        this.disableScreenRendering = disableScreenRendering;
    }
}