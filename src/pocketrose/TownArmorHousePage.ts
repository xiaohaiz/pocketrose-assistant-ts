import Role from "../common/Role";
import Credential from "../util/Credential";

class TownArmorHousePage {

    readonly credential: Credential;
    readonly townId: string;

    discount?: number;
    role?: Role;

    constructor(credential: Credential, townId: string) {
        this.credential = credential;
        this.townId = townId;
    }
}

export = TownArmorHousePage;