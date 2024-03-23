import Credential from "../../util/Credential";
import PersonalEquipmentManagement from "./PersonalEquipmentManagement";
import LocalSettingManager from "../config/LocalSettingManager";
import BattleFieldTrigger from "../trigger/BattleFieldTrigger";
import EquipmentGrowthTrigger from "../trigger/EquipmentGrowthTrigger";

class PersonalEquipmentManagementInterceptor {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async beforeExitEquipmentManagement() {
        const equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        const spaceCount = equipmentPage.spaceCount;
        LocalSettingManager.setEquipmentCapacityMax(this.#credential.id, spaceCount <= 1);

        await new BattleFieldTrigger(this.#credential)
            .triggerUpdate();

        await new EquipmentGrowthTrigger(this.#credential)
            .withEquipmentPage(equipmentPage)
            .triggerEquipmentExperience();
    }
}

export = PersonalEquipmentManagementInterceptor;