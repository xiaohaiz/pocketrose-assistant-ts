import TownPetMapHouse from "../pocketrose/TownPetMapHouse";
import Credential from "../util/Credential";
import StorageUtils from "../util/StorageUtils";

class PetLocalStorage {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async updatePetMap(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                new TownPetMapHouse(this.#credential).open().then(page => {
                    const value = page.asText();
                    const key = "_pm_" + this.#credential.id;
                    StorageUtils.set(key, value);
                    resolve();
                });
            });
        })();
    }
}

export = PetLocalStorage;