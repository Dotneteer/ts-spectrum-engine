import { SpectrumViewModelBase } from "./SpectrumViewModelBase";
import { ChildViewModelBase } from "./ChildViewModelBase";

/**
 * This class is intended to be the base class of all containers that can nest 
 * child view models
 */
export abstract class ContainerViewModelBase extends SpectrumViewModelBase {
    private _childViewModels: ChildViewModelBase<ContainerViewModelBase>[] = [];
    private _focusedChild: ChildViewModelBase<ContainerViewModelBase> | undefined;

    /**
     * The children of this container
     */
    get childViewModels(): ChildViewModelBase<ContainerViewModelBase>[] {
        return this._childViewModels;
    }

    /**
     * Add a new child to the container
     * @param child Child to add to the container
     */
    addChild(child: ChildViewModelBase<ContainerViewModelBase>) {
        this._childViewModels.push(child);
        $(child.paneId).click(e => {
            this.setFocus(child);
        });
        $(child.paneHeaderId).click(e => {
            this.setFocus(child);
        });
    }

    /**
     * Executes the specified action for each child view models
     * @param action Action to execute
     */
    forEachChild(action: (child: ChildViewModelBase<ContainerViewModelBase>) => void) {
        this._childViewModels.forEach(child => action(child));
    }

    /**
     * Gets the child that has the keyboard focus
     */
    get focusedChild(): ChildViewModelBase<ContainerViewModelBase> | undefined {
        return this._focusedChild;
    }

    /**
     * Sets the keyboard focus to the specified child
     * @param child Child that has the focus
     */
    setFocus(child: ChildViewModelBase<ContainerViewModelBase>) {
        if (child === this._focusedChild || !child.canReceiveFocus) {
            return;
        }
        if (this._focusedChild) {
            this._focusedChild._raiseLostFocus();
        }
        this._focusedChild = child;
        setTimeout(() => {
            if (this && this._focusedChild) {
                this._focusedChild._raiseGotFocus();
            }
        }, 0);
    }
}