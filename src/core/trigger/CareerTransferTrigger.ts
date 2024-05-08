import Credential from "../../util/Credential";
import SetupLoader from "../config/SetupLoader";
import {PersonalStatus} from "../role/PersonalStatus";
import {RoleStatusManager} from "../role/RoleStatus";

class CareerTransferTrigger {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async trigger(handler?: () => void) {
        let level = (await new RoleStatusManager(this.credential).load())?.readLevel;
        if (level === undefined) {
            level = (await new PersonalStatus(this.credential).load()).level!;
        }
        if (level !== 150) {
            return;
        }
        let mirrorIndex = (await new RoleStatusManager(this.credential).load())?.readMirrorIndex;
        if (mirrorIndex === undefined) {
            mirrorIndex = (await new PersonalStatus(this.credential).load()).mirrorIndex!;
        }
        const config: any = SetupLoader.loadMirrorCareerFixedConfig(this.credential.id);
        if (config["_m_" + mirrorIndex]) {
            return;
        }
        (handler) && (handler());
    }

}

export {CareerTransferTrigger};