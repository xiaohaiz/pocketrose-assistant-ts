import {Equipment} from "../equipment/Equipment";
import Role from "../role/Role";
import TownGemMeltHousePage from "./TownGemMeltHousePage";

class TownGemHousePage {

    role?: Role;
    equipmentList?: Equipment[];
    gemList?: Equipment[];
    townGemMeltHousePage?: TownGemMeltHousePage;

    get hasPowerGem() {
        for (const gem of this.gemList!) {
            if (gem.name === "威力宝石") {
                return true;
            }
        }
        return false;
    }

    get hasWeightGem() {
        for (const gem of this.gemList!) {
            if (gem.name === "重量宝石") {
                return true;
            }
        }
        return false;
    }

    get hasLuckGem() {
        for (const gem of this.gemList!) {
            if (gem.name === "幸运宝石") {
                return true;
            }
        }
        return false;
    }

    findEquipment(index: number) {
        for (const equipment of this.equipmentList!) {
            if (equipment.index === index) {
                return equipment;
            }
        }
        return null;
    }

    findGem(index: number) {
        for (const gem of this.gemList!) {
            if (gem.index === index) {
                return gem;
            }
        }
        return null;
    }

}

export = TownGemHousePage;