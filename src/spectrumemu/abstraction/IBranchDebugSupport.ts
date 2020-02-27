import { BranchEvent } from "../cpu/BranchEvent";

/**
 * This interface provides information that support debugging branching statements
 */
export interface IBranchDebugSupport
{
    /**
     * Records a branching event
     * @param ev Event to record
     */
    recordBranchEvent(ev: BranchEvent ): void;
}
