import Equipment from "../equipment/Equipment";
import Role from "../role/Role";
import TownLoader from "../town/TownLoader";
import Merchandise from "./Merchandise";

class TownItemHousePage {

    townId?: string;
    discount?: number;
    role?: Role;
    equipmentList?: Equipment[];
    merchandiseList?: Merchandise[];

    get town() {
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

export = TownItemHousePage;