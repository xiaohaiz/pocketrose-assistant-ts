import Credential from "../util/Credential";

class CastleBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }
}

export = CastleBank;