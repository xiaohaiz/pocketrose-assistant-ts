import Equipment from "../core/equipment/Equipment";
import Role from "../core/role/Role";

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