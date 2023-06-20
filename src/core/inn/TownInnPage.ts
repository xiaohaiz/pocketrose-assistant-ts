import Role from "../role/Role";

class TownInnPage {

    readonly role: Role;
    lodgeFee: number = 0;

    constructor(role: Role) {
        this.role = role;
    }

}

export = TownInnPage;