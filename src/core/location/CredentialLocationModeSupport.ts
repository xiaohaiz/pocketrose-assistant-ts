import Credential from "../../util/Credential";
import LocationModeCastle from "./LocationModeCastle";
import LocationModeMap from "./LocationModeMap";
import LocationModeMetro from "./LocationModeMetro";
import LocationModeTown from "./LocationModeTown";
import Role from "../role/Role";
import PersonalStatus from "../role/PersonalStatus";

abstract class CredentialLocationModeSupport {

    readonly credential: Credential;
    readonly locationMode: LocationModeCastle | LocationModeMap | LocationModeMetro | LocationModeTown;

    protected constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeMap | LocationModeMetro | LocationModeTown) {
        this.credential = credential;
        this.locationMode = locationMode;
    }

    protected get isTownMode() {
        return this.locationMode instanceof LocationModeTown;
    }

    protected get isCastleMode() {
        return this.locationMode instanceof LocationModeCastle;
    }

    protected get townId(): string | undefined {
        return this.isTownMode ? (this.locationMode as LocationModeTown).townId : undefined;
    }

    protected async reInitializeRole(external?: Role, predicate?: (role: Role) => boolean): Promise<Role> {
        if (external !== undefined) {
            if (predicate === undefined) {
                return external;
            }
            if (predicate(external)) {
                return external;
            }
        }
        return await new PersonalStatus(this.credential).load();
    }
}

export = CredentialLocationModeSupport;