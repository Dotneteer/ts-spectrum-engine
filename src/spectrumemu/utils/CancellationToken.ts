/**
 * This interface represents a cancellation token
 */
export interface CancellationToken {
  /**
   * Tests if cancellation has been requested.
   */
  readonly isCancellationRequested: boolean;
}

/**
 * This class implements a {@link CancellationToken}.
 */
export class MutableToken implements CancellationToken {
  private _isCancelled = false;

  /**
   * Signs cancellation
   */
  public cancel() {
    if (!this._isCancelled) {
      this._isCancelled = true;
    }
  }

  /**
   * Tests if cancellation has been requested.
   */
  get isCancellationRequested(): boolean {
    return this._isCancelled;
  }
}

// tslint:disable-next-line:no-namespace
export namespace CancellationToken {
  export const None: CancellationToken = Object.freeze({
    isCancellationRequested: false
  });

  export const Cancelled: CancellationToken = Object.freeze({
    isCancellationRequested: true
  });
}
