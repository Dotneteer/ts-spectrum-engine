import { SpectrumViewModelBase } from "./SpectrumViewModelBase";
import { ContainerViewModelBase } from "./ContainerViewModelBase";
import { LiteEvent, ILiteEvent } from "../emulator/LiteEvent";

/**
 * This class is intended to be the base of all view models that represent
 * a child within a container.
 */
export abstract class ChildViewModelBase<TParent extends ContainerViewModelBase> extends SpectrumViewModelBase {
    private _gotFocus = new LiteEvent<void>();
    private _lostFocus = new LiteEvent<void>();

    /**
     * Creates a child view model attached to its parent
     * @param _parent Parent container instance
     */
    constructor(private _parent: TParent) {
        super();
        _parent.addChild(this);
    }

    /**
     * Gets the parent container of this view model
     */
    get parent(): TParent {
        return this._parent;
    }

    /**
     * Gets the ID of the pane
     */
    get paneId(): string {
        return "#no-pane-tag";
    } 

    /**
     * Gets the ID of the pane header
     */
    get paneHeaderId(): string {
        return "#no-header-tag";
    }
    
    /**
     * This event is raised when the child receives the focus
     */
    get gotFocus(): ILiteEvent<void> {
        return this._gotFocus.expose();
    }

    /**
     * This event is raised when the child loses the focus
     */
    get lostFocus(): ILiteEvent<void> {
        return this._lostFocus.expose();
    }

    /**
     * Indicates if the child panel can receive keyboard focus
     */
    get canReceiveFocus(): boolean {
        return true;
    }

    /**
     * Handle the key down event
     * @param e Event arguments
     */
    onKeydown(e: JQuery.Event):void {
    }

    /**
     * Handle the key up event
     * @param e Event arguments
     */
    onKeyup(e: JQuery.Event):void {
    }

    /**
     * Handle the keypress event
     * @param e Event arguments
     */
    onKeypress(e: JQuery.Event):void {
    }

    /**
     * Raises the gotFocus event
     */
    _raiseGotFocus() {
        this._gotFocus.trigger();
    }

    /**
     * Raises the lostFocus event
     */
    _raiseLostFocus() {
        this._lostFocus.trigger();
    }

    /**
     * This member is called when it is time to init the
     * view model
     */
    init(): void {
        super.init();
        
        this._gotFocus.on(() => {
            // ---
        });

        this._lostFocus.on(() => {
            // ---
        });
    }
}