import Equipment from "../equipment/Equipment";
import Role from "../role/Role";

class TownForgePage {

    role: Role;
    equipmentList: Equipment[];

    constructor(role: Role) {
        this.role = role;
        this.equipmentList = [];
    }
}

export = TownForgePage;