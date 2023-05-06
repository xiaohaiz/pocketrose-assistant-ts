import Credential from "../util/Credential";

class PersonalStatus {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }


}

export = PersonalStatus;