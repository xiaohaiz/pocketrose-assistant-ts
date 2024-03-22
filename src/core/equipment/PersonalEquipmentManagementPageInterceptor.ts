import Credential from "../../util/Credential";

class PersonalEquipmentManagementPageInterceptor {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }
}

export = PersonalEquipmentManagementPageInterceptor;