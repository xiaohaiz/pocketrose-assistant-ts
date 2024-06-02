import Role from "../role/Role";
import {Equipment} from "./Equipment";

class PersonalEquipmentManagementPage {

    role?: Role;
    equipmentList?: Equipment[];

    get spaceCount() {
        return 20 - this.equipmentList!.length;
    }

    get usingWeapon(): Equipment | null {
        return this.equipmentList?.find(it => it.using && it.isWeapon) ?? null;
    }

    get usingArmor(): Equipment | null {
        return this.equipmentList?.find(it => it.using && it.isArmor) ?? null;
    }

    get usingAccessory(): Equipment | null {
        return this.equipmentList?.find(it => it.using && it.isAccessory) ?? null;
    }

    findEquipment(index: number) {
        return this.equipmentList?.find(it => it.index === index) ?? null;
    }

    findTreasureBag() {
        return this.equipmentList?.find(it => it.isTreasureBag) ?? null;
    }

    findGoldenCage() {
        return this.equipmentList?.find(it => it.isGoldenCage) ?? null;
    }

}

export = PersonalEquipmentManagementPage;