import Credential from "../util/Credential";

class GoldenCage {

    readonly #credential: Credential;
    readonly #goldenCageIndex: number;

    constructor(credential: Credential, goldenCageIndex: number) {
        this.#credential = credential;
        this.#goldenCageIndex = goldenCageIndex;
    }

}

export = GoldenCage;