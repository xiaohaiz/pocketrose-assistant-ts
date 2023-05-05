import Credential from "../../util/Credential";
import Equipment from "../Equipment";

class EquipmentManagementPage {

    readonly credential: Credential;
    equipmentList?: Equipment[];

    constructor(credential: Credential) {
        this.credential = credential;
    }

    findEquipment(index: number) {
        if (this.equipmentList === undefined) {
            return null;
        }
        for (const equipment of this.equipmentList) {
            if (equipment.index === index) {
                return equipment;
            }
        }
        return null;
    }
}

export = EquipmentManagementPage;