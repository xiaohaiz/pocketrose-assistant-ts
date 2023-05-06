import Credential from "../util/Credential";

class PersonalStatusPage {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }


}

export = PersonalStatusPage;