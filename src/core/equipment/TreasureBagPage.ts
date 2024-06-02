import {Equipment} from "./Equipment";

class TreasureBagPage {

    equipmentList?: Equipment[];

    get sortedEquipmentList(): Equipment[] {
        return Equipment.sortEquipmentList(this.equipmentList!);
    }

    get spaceCount() {
        return 50 - this.equipmentList!.length;
    }

}

export = TreasureBagPage;