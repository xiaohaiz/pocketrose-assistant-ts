import CredentialLocationModeSupport from "../core/location/CredentialLocationModeSupport";
import Credential from "../util/Credential";
import LocationModeTown from "../core/location/LocationModeTown";
import Role from "../core/role/Role";

class MirrorManagerComponent extends CredentialLocationModeSupport {

    constructor(credential: Credential, locationMode: LocationModeTown) {
        super(credential, locationMode);
    }

    generateHTML(): string {
        return "";
    }

    async reload(external?: Role) {
        const role = await this.reInitializeRole(
            external,
            role => role.mirrorIndex !== undefined && role.mirrorCount !== undefined
        );
    }

    async render(external?: Role) {
        const role = await this.reInitializeRole(
            external,
            role => role.mirrorIndex !== undefined && role.mirrorCount !== undefined
        );
    }
}

export = MirrorManagerComponent;