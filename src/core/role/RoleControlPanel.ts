import Credential from "../../util/Credential";
import OperationMessage from "../../util/OperationMessage";
import LocalSettingManager from "../config/LocalSettingManager";
import SetupLoader from "../config/SetupLoader";
import PersonalStatus from "./PersonalStatus";
import Role from "./Role";

class RoleControlPanel {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async isCareerTransferEnabled(): Promise<boolean> {
        let currentMirrorIndex = LocalSettingManager.getMirrorIndex(this.#credential.id);
        if (currentMirrorIndex === undefined) {
            currentMirrorIndex = (await new PersonalStatus(this.#credential).load()).mirrorIndex!;
        }
        const config: any = SetupLoader.loadMirrorCareerFixedConfig(this.#credential.id);
        return !config["_m_" + currentMirrorIndex];
    }

    async triggerCareerTransferNotification(role: Role): Promise<OperationMessage> {
        if (role.level !== 150) {
            return OperationMessage.failure();
        }
        let currentMirrorIndex = LocalSettingManager.getMirrorIndex(this.#credential.id);
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