import Credential from "../util/Credential";
import Role from "./Role";

class PersonalEquipmentManagementPage {

    readonly credential: Credential;

    role?: Role;

    constructor(credential: Credential) {
        this.credential = credential;
    }
}

export = PersonalEquipmentManagementPage;