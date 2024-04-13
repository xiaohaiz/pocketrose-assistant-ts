import {Equipment} from "./Equipment";
import _ from "lodash";

class TreasureBagPage {

    equipmentList?: Equipment[];

    get sortedEquipmentList(): Equipment[] {
        return Equipment.sortEquipmentList(this.equipmentList!);
    }

    get spaceCount() {
        return 50 - this.equipmentList!.length;
    }

    findGems(c?: string) {
        const category = c === undefined ? "ALL" : c;
        if (this.equipmentList === undefined) return [];
        return _.forEach(this.equipmentList!)
            .filter(it => it.checkGem(category));
    }
}

export = TreasureBagPage;