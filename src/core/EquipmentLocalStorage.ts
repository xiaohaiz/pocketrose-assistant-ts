import Credential from "../util/Credential";

class EquipmentLocalStorage {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }
}

export = EquipmentLocalStorage;