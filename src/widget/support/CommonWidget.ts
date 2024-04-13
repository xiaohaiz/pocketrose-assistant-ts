import Credential from "../../util/Credential";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import LocationModeMap from "../../core/location/LocationModeMap";
import LocationModeMetro from "../../core/location/LocationModeMetro";
import LocationModeTown from "../../core/location/LocationModeTown";
import Role from "../../core/role/Role";
import PersonalStatus from "../../core/role/PersonalStatus";
import {LocationModeSupport} from "./LocationModeSupport";

abstract class CommonWidget extends LocationModeSupport {

    protected constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeMap | LocationModeMetro | LocationModeTown) {
        super(credential, locationMode);
    }

    protected async reInitializeRole(externalRole: Role | undefined | null,
                                     predicate?: (role: Role) => boolean): Promise<Role | undefined> {
        if (externalRole !== undefined && externalRole !== null) {
            if (predicate === undefined) {
                return externalRole;
            }
            if (predicate(externalRole)) {
                return externalRole;
            }
        }
        if (this.isMapMode) return undefined;   // 地图模式下无法查看个人状态
        return await new PersonalStatus(this.credential).load();
    }

    protected turnOnSpanButton(btnId: string) {
        $("#" + btnId)
            .prop("disabled", false)
            .parent().show();
    }

    protected turnOffSpanButton(btnId: string) {
        $("#" + btnId)
            .prop("disabled", true)
            .parent().hide();
    }
}

export = CommonWidget;