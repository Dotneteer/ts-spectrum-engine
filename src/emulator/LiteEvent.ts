/**
 * Defines the behavior of a light-weight event handler
 */
export interface ILiteEvent<T> {
    /**
     * Adds a new event handler
     * @param handler Handler method
     */
    on(handler: { (data?: T): void }) : void;

    /**
     * Removes the specified event handler
     * @param handler Handler method
     */
    off(handler: { (data?: T): void }) : void;

    /**
     * Number of handlers attached
     */
    handlers: number;
}

/**
 * This class implements a simple multi-subscriber event
 */
export class LiteEvent<T> {
    private _handlers: { (data?: T): void; }[] = [];

    /**
     * Adds a new event handler
     * @param handler Handler method
     */
    public on(handler: { (data?: T): void }) : void {
        this._handlers.push(handler);
    }

    /**
     * Removes the specified event handler
     * @param handler Handler method
     */
    public off(handler: { (data?: T): void }) : void {
        this._handlers = this._handlers.filter(h => h !== handler);
    }

    /**
     * Raises the event
     * @param data Event data
     */
    public trigger(data?: T) {
        this._handlers.slice(0).forEach(h => h(data));
    }

    /**
     * Number of handlers attached
     */
    public get handlers(): number {
        return this._handlers.length;
    }

    /**
     * Exposes the methods to subscribe to the event
     */
    public expose() : ILiteEvent<T> {
        return this;
    }
}