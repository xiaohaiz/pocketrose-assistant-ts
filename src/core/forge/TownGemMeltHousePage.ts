import Equipment from "../equipment/Equipment";
import Role from "../role/Role";

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