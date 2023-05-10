import Credential from "../util/Credential";

/**
 * @deprecated
 */
class DeprecatedTownBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }



}

export = DeprecatedTownBank;