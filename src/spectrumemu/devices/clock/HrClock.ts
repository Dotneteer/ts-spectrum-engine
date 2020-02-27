/**
 * Frequency is 1e6 (semi-microsecond accuracy)
 */
const _frequency = 1_000_000_000;

export class HrClock {
    /**
     * Retrieves the frequency of the clock. This value shows new
     * number of clock ticks per second.
     */
    getFrequency(): number {
        return _frequency;
    }

    /**
     * Retrieves the current counter value of the clock.
     */
    getCounter(): number {
        const time  = performance.now();
        return time * 1_000_000;
    }
}