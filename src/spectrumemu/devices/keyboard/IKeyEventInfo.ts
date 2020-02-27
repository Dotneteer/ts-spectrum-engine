/**
 * Information used for key processing
 */
export interface IKeyEventInfo {
    /**
     * Code of the pressed key
     */
    keyCode?: number;

    /**
     * True, if Alt key is pressed
     */
    altKey: boolean;

    /**
     * True, if Ctrl key is pressed
     */
    ctrlKey: boolean;

    /**
     * True, if Shift key is pressed
     */
    shiftKey: boolean;
}