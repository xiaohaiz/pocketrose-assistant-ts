import Role from "../role/Role";
import Equipment from "./Equipment";
import _ from "lodash";

class PersonalEquipmentManagementPage {

    role?: Role;
    equipmentList?: Equipment[];

    get spaceCount() {
        return 20 - this.equipmentList!.length;
    }

    get usingWeapon(): Equipment | null {
        for (const equipment of this.equipmentList!) {
            if (equipment.using && equipment.isWeapon) {
                return equipment;
            }
        }
        return null;
    }

    get usingArmor(): Equipment | null {
        for (const equipment of this.equipmentList!) {
            if (equipment.using && equipment.isArmor) {
                return equipment;
            }
        }
        return null;
    }

    get usingAccessory(): Equipment | null {
        for (const equipment of this.equipmentList!) {
            if (equipment.using && equipment.isAccessory) {
                return equipment;
            }
        }
        return null;
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

    findGems(c?: string) {
        const category = c === undefined ? "ALL" : c;
        return _.forEach(this.equipmentList!)
            .filter(it => it.checkGem(category));
    }
}

export = PersonalEquipmentManagementPage;