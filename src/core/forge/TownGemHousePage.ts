import {Equipment} from "../equipment/Equipment";
import TownGemMeltHousePage from "./TownGemMeltHousePage";

class TownGemHousePage {

    equipmentList?: Equipment[];
    gemList?: Equipment[];
    townGemMeltHousePage?: TownGemMeltHousePage;

    findEquipment(index: number) {
        return this.equipmentList?.find(it => it.index === index) ?? null;
    }

    findGem(index: number) {
        return this.gemList?.find(it => it.index === index) ?? null;
    }

}

export = TownGemHousePage;