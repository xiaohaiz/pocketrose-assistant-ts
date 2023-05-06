import Credential from "../util/Credential";
import Role from "./Role";

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