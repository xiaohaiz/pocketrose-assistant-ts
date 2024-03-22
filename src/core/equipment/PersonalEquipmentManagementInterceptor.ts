import Credential from "../../util/Credential";

class PersonalEquipmentManagementInterceptor {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }
}

export = PersonalEquipmentManagementInterceptor;