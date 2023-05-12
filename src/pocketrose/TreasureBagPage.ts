import Equipment from "../common/Equipment";

class TreasureBagPage {

    equipmentList?: Equipment[];

    get sortedEquipmentList(): Equipment[] {
        return Equipment.sortEquipmentList(this.equipmentList!);
    }

}

export = TreasureBagPage;