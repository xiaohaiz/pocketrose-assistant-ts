import Credential from "../../util/Credential";

class TownGemMeltHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

}

export = TownGemMeltHouse;