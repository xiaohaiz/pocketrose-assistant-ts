import Equipment from "../common/Equipment";
import Role from "../common/Role";

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