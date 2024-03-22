import Credential from "../../util/Credential";
import PersonalEquipmentManagement from "./PersonalEquipmentManagement";
import LocalSettingManager from "../config/LocalSettingManager";
import BattleFieldManager from "../battle/BattleFieldManager";
import EquipmentExperienceManager from "./EquipmentExperienceManager";

class PersonalEquipmentManagementInterceptor {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async beforeExitEquipmentManagement() {
        const equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        const spaceCount = equipmentPage.spaceCount;
        LocalSettingManager.setEquipmentCapacityMax(this.#credential.id, spaceCount <= 1);

        await new BattleFieldManager(this.#credential)
            .autoSetBattleField();

        await new EquipmentExperienceManager(this.#credential)
            .withEquipmentPage(equipmentPage)
            .triggerEquipmentExperience();
    }
}

export = PersonalEquipmentManagementInterceptor;