import {CredentialSupport} from "./CredentialSupport";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import LocationModeMap from "../../core/location/LocationModeMap";
import LocationModeMetro from "../../core/location/LocationModeMetro";
import LocationModeTown from "../../core/location/LocationModeTown";
import Credential from "../../util/Credential";

abstract class LocationModeSupport extends CredentialSupport {

    readonly locationMode: LocationModeCastle | LocationModeMap | LocationModeMetro | LocationModeTown;

    protected constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeMap | LocationModeMetro | LocationModeTown) {
        super(credential);
        this.locationMode = locationMode;
    }

    protected get isTownMode() {
        return this.locationMode instanceof LocationModeTown;
    }

    protected get isCastleMode() {
        return this.locationMode instanceof LocationModeCastle;
    }

    protected get isMapMode() {
        return this.locationMode instanceof LocationModeMap;
    }

    protected get isMetroMode() {
        return this.locationMode instanceof LocationModeMetro;
    }

    protected get townId(): string | undefined {
        return this.isTownMode ? (this.locationMode as LocationModeTown).townId : undefined;
    }
}

export {LocationModeSupport};