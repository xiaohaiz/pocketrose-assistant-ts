import Equipment from "../core/equipment/Equipment";
import Role from "../core/role/Role";
import Merchandise from "../core/store/Merchandise";
import Town from "../core/town/Town";
import TownLoader from "../core/town/TownLoader";

class TownArmorHousePage {

    townId?: string;
    discount?: number;
    role?: Role;
    equipmentList?: Equipment[];
    merchandiseList?: Merchandise[];

    get town(): Town {
        return TownLoader.load(this.townId)!;
    }

    findEquipment(index: number) {
        for (const equipment of this.equipmentList!) {
            if (equipment.index === index) {
                return equipment;
            }
        }
        return null;
    }

    findMerchandise(index: number) {
        for (const merchandise of this.merchandiseList!) {
            if (merchandise.index === index) {
                return merchandise;
            }
        }
        return null;
    }
}

export = TownArmorHousePage;