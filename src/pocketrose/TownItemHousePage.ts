import Equipment from "../common/Equipment";
import Merchandise from "../common/Merchandise";
import Role from "../common/Role";
import TownLoader from "../core/TownLoader";

class TownItemHousePage {

    townId?: string;
    discount?: number;
    role?: Role;
    equipmentList?: Equipment[];
    merchandiseList?: Merchandise[];

    get town() {
        return TownLoader.getTownById(this.townId!)!;
    }
}

export = TownItemHousePage;