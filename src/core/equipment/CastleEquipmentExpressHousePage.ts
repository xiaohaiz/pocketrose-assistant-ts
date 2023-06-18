import Role from "../role/Role";
import Equipment from "./Equipment";

class CastleEquipmentExpressHousePage {

    role?: Role;
    equipmentList?: Equipment[];

    canSend(index: number) {
        for (const equipment of this.equipmentList!) {
            if (equipment.index! === index) {
                return equipment.selectable!;
            }
        }
        return false;
    }
}

export = CastleEquipmentExpressHousePage;