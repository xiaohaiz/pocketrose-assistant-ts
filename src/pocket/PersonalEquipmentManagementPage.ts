import Credential from "../util/Credential";
import Role from "./Role";
import Equipment from "./Equipment";

class PersonalEquipmentManagementPage {

    readonly credential: Credential;

    role?: Role;
    equipmentList?: Equipment[];

    constructor(credential: Credential) {
        this.credential = credential;
    }
}

export = PersonalEquipmentManagementPage;