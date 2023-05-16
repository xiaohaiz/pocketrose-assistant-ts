import Credential from "../util/Credential";

class PersonalPetEvolution {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

}

export = PersonalPetEvolution;