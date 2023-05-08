import Credential from "../util/Credential";

class TownBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

}

function doParsePage(html: string) {
}

export = TownBank;