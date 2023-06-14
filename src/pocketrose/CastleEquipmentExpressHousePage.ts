import Equipment from "../core/equipment/Equipment";
import Role from "../core/role/Role";

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