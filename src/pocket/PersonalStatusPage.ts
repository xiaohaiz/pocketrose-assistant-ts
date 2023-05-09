import Role from "../common/Role";
import Credential from "../util/Credential";

class PersonalStatusPage {

    readonly credential: Credential;

    role?: Role;

    constructor(credential: Credential) {
        this.credential = credential;
    }


}

export = PersonalStatusPage;