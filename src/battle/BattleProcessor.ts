import Credential from "../util/Credential";

class BattleProcessor {

    readonly #credential: Credential;
    readonly #html: string;

    constructor(credential: Credential, html: string) {
        this.#credential = credential;
        this.#html = html;
    }


}

export = BattleProcessor;