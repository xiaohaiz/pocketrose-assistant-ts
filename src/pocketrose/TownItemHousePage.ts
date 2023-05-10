import Equipment from "../common/Equipment";
import Merchandise from "../common/Merchandise";
import Role from "../common/Role";

class TownItemHousePage {

    townId?: string;
    discount?: number;
    role?: Role;
    equipmentList?: Equipment[];
    merchandiseList?: Merchandise[];

}

export = TownItemHousePage;