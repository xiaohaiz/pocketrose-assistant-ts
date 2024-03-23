import Credential from "../../util/Credential";
import BattleFieldTrigger from "../trigger/BattleFieldTrigger";
import EquipmentGrowthTrigger from "../trigger/EquipmentGrowthTrigger";
import EquipmentSpaceTrigger from "../trigger/EquipmentSpaceTrigger";
import PersonalEquipmentManagementPageLoader from "./PersonalEquipmentManagementPageLoader";

class EquipmentManagementReturnInterceptor {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async beforeExitEquipmentManagement() {
        const loader = new PersonalEquipmentManagementPageLoader(this.#credential);
        const equipmentPage = await loader.load();
        await Promise.all([
            new EquipmentSpaceTrigger(this.#credential)
                .withEquipmentPage(equipmentPage)
                .triggerUpdate(),
            new BattleFieldTrigger(this.#credential)
                .triggerUpdate(),
            new EquipmentGrowthTrigger(this.#credential)
                .withEquipmentPage(equipmentPage)
                .triggerUpdate(),
        ]);
    }
}

export = EquipmentManagementReturnInterceptor;