import Credential from "../util/Credential";
import Role from "./Role";

class PersonalStatusPage {

    readonly #credential: Credential;

    role?: Role;

    constructor(credential: Credential) {
        this.#credential = credential;
    }


}

export = PersonalStatusPage;