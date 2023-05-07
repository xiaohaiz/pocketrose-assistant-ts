import Credential from "../util/Credential";
import Role from "./Role";
import Equipment from "./Equipment";
import EquipmentParser from "./EquipmentParser";

class PersonalEquipmentManagementPage {

    readonly credential: Credential;

    role?: Role;
    equipmentList?: Equipment[];

    constructor(credential: Credential) {
        this.credential = credential;
    }

    findTreasureBag(): Equipment | null {
        return EquipmentParser.findTreasureBag(this.equipmentList);
    }
}

export = PersonalEquipmentManagementPage;