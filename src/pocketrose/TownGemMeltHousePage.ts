import Equipment from "../common/Equipment";
import Role from "../common/Role";

class TownGemMeltHousePage {

    role?: Role;
    equipmentList?: Equipment[];

    canMelt(index: number) {
        for (const equipment of this.equipmentList!) {
            if (equipment.index === index) {
                return equipment.selectable!;
            }
        }
        return false;
    }

}

export = TownGemMeltHousePage;