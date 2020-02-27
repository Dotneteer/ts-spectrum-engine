import { SpectrumEdition } from "./SpectrumEdition";

/**
 * This class describes the editions of a particular Spectrum model
 */
export class SpectrumModelEditions {
    private _editions = new Map<string, SpectrumEdition>();

    /**
     * The available revisions of this Spectrum model
     */
    get editions(): Map<string, SpectrumEdition> {
        return this._editions;
    }

    /**
     * Adds/sets the specified edition and key to the collection
     * @param key Edition key
     * @param edition Edition properties
     */
    set(key: string, edition: SpectrumEdition): SpectrumModelEditions {
        this._editions.set(key, edition);
        return this;
    }

    /**
     * Checks if the specified edition can be found in the collection.
     * @param key Edition key
     */
    has(key: string): boolean {
        return this._editions.has(key);
    }

    /**
     * Gets a clone of the specified edition
     * @param key Edition key
     */
    getClone(key: string): SpectrumEdition | undefined {
        const edition = this._editions.get(key);
        return edition
            ? edition.clone()
            : undefined;
    }
}