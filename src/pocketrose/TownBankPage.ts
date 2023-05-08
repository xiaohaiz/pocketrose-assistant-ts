import Credential from "../util/Credential";

class TownBankPage {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

}

export = TownBankPage;