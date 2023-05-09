import Equipment from "../common/Equipment";

class TownGemMeltHousePage {

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