/**
 * Delays the execution with the specified amount of milliseconds. Allows
 * the JavaScript event loop to run while waiting
 * @param milliseconds Number of milliseconds to wait
 */
export function delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => {
        if (milliseconds < 0) {
            milliseconds = 0;
        } 
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}

/**
 * Allows the JavaScript event loop to process waiting messages
 */
export function processMessages(): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, 0);
    });
}
