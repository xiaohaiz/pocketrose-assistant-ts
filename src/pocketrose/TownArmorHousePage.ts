import Equipment from "../common/Equipment";
import Merchandise from "../common/Merchandise";
import Role from "../common/Role";
import Town from "../core/Town";
import TownLoader from "../core/TownLoader";

class TownArmorHousePage {

    townId?: string;
    discount?: number;
    role?: Role;
    equipmentList?: Equipment[];
    merchandiseList?: Merchandise[];

    get town(): Town {
        return TownLoader.getTownById(this.townId!)!;
    }
}

export = TownArmorHousePage;