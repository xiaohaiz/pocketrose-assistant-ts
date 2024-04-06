import Equipment from "./Equipment";
import _ from "lodash";

class CastleWarehousePage {

    roleCash?: number;
    personalEquipmentList?: Equipment[];
    storageEquipmentList?: Equipment[];

    findGems(c?: string) {
        const category = c === undefined ? "ALL" : c;
        if (this.storageEquipmentList === undefined) return [];
        return _.forEach(this.storageEquipmentList!)
            .filter(it => it.checkGem(category));
    }
}

export = CastleWarehousePage;