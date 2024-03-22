import Credential from "../../util/Credential";

class PersonalPetManagementInterceptor {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async beforeQuitPersonalPetManagement() {
    }
}

export = PersonalPetManagementInterceptor;