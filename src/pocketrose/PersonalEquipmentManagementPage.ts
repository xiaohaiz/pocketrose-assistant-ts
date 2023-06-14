import Equipment from "../core/equipment/Equipment";
import Role from "../core/role/Role";

class PersonalEquipmentManagementPage {

    role?: Role;
    equipmentList?: Equipment[];

    get spaceCount() {
        return 20 - this.equipmentList!.length;
    }

    findEquipment(index: number) {
        for (const equipment of this.equipmentList!) {
            if (equipment.index === index) {
                return equipment;
            }
        }
        return null;
    }

    findTreasureBag() {
        for (const equipment of this.equipmentList!) {
            if (equipment.isTreasureBag) {
                return equipment;
            }
        }
        return null;
    }

    findGoldenCage() {
        for (const equipment of this.equipmentList!) {
            if (equipment.isGoldenCage) {
                return equipment;
            }
        }
        return null;
    }
}

export = PersonalEquipmentManagementPage;