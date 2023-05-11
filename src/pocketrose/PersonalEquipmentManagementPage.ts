import Equipment from "../common/Equipment";
import Role from "../common/Role";

class PersonalEquipmentManagementPage {

    role?: Role;
    equipmentList?: Equipment[];

    get spaceCount() {
        return 20 - this.equipmentList!.length;
    }

    findTreasureBag() {
        for (const equipment of this.equipmentList!) {
            if (equipment.isTreasureBag) {
                return equipment;
            }
        }
        return null;
    }
}

export = PersonalEquipmentManagementPage;