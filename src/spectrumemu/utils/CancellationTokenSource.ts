import { CancellationToken, MutableToken } from "./CancellationToken";

/**
 * This class implements a source for {@link CancellationToken}.
 * This is a lightweight cancellation token that does not support
 * cancellation events. This token does not need disposal.
 */
export class CancellationTokenSource {
  private _token: CancellationToken | undefined;

  /**
   * Gets a cancellation token for the source
   */
  get token(): CancellationToken {
    if (!this._token) {
      // --- Be lazy and create the token only when actually needed
      this._token = new MutableToken();
    }
    return this._token;
  }

  /**
   * Signs cancellation
   */
  cancel(): void {
    if (!this._token) {
      // --- Save an object by returning the default cancelled token
      // --- when cancellation happens before someone asks for the token
      this._token = CancellationToken.Cancelled;
    } else if (this._token instanceof MutableToken) {
      // --- actually cancel
      this._token.cancel();
    }
  }
}
