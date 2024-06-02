import {Equipment} from "../equipment/Equipment";

class TownGemMeltHousePage {

    equipmentList: Equipment[];

    constructor() {
        this.equipmentList = [];
    }

    canMelt(index: number) {
        return this.equipmentList.find(it => it.index === index)?.selectable ?? false;
    }

}

export = TownGemMeltHousePage;