import Credential from "../../util/Credential";
import OperationMessage from "../../util/OperationMessage";
import SetupLoader from "../config/SetupLoader";
import {PersonalStatus} from "./PersonalStatus";
import Role from "./Role";
import {RoleStatusManager} from "./RoleStatus";

/**
 * @deprecated
 */
class RoleControlPanel {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async triggerCareerTransferNotification(role: Role): Promise<OperationMessage> {
        if (role.level !== 150) {
            return OperationMessage.failure();
        }
        let currentMirrorIndex = await new RoleStatusManager(this.#credential).getCurrentMirrorIndex();
        if (currentMirrorIndex === undefined) {
            currentMirrorIndex = (await new PersonalStatus(this.#credential).load()).mirrorIndex!;
        }
        const config: any = SetupLoader.loadMirrorCareerFixedConfig(this.#credential.id);
        if (config["_m_" + currentMirrorIndex]) {
            // 当前的分身已经定型了
            return OperationMessage.failure();
        }
        return OperationMessage.success();
    }

}

export = RoleControlPanel;