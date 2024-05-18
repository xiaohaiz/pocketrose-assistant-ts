import {Equipment} from "./Equipment";

class CastleWarehousePage {

    roleCash?: number;
    personalEquipmentList?: Equipment[];
    storageEquipmentList?: Equipment[];

    get sortStorageEquipmentList(): Equipment[] {
        if (this.storageEquipmentList === undefined) return [];
        return Equipment.sortEquipmentList(this.storageEquipmentList);
    }
}

export = CastleWarehousePage;