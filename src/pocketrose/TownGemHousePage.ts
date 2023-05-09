import Equipment from "../common/Equipment";
import Role from "../common/Role";
import TownGemMeltHousePage from "./TownGemMeltHousePage";

class TownGemHousePage {

    role?: Role;
    equipmentList?: Equipment[];
    gemList?: Equipment[];
    townGemMeltHousePage?: TownGemMeltHousePage;

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