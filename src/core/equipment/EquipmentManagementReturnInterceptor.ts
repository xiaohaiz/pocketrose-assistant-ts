import Credential from "../../util/Credential";
import PersonalEquipmentManagement from "./PersonalEquipmentManagement";
import BattleFieldTrigger from "../trigger/BattleFieldTrigger";
import EquipmentGrowthTrigger from "../trigger/EquipmentGrowthTrigger";
import PersonalEquipmentManagementPage from "./PersonalEquipmentManagementPage";
import EquipmentSpaceTrigger from "../trigger/EquipmentSpaceTrigger";

class EquipmentManagementReturnInterceptor {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #equipmentPage?: PersonalEquipmentManagementPage;

    withEquipmentPage(value: PersonalEquipmentManagementPage | undefined): EquipmentManagementReturnInterceptor {
        this.#equipmentPage = value;
        return this;
    }

    async #initializeEquipmentPage() {
        if (!this.#equipmentPage) {
            this.#equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        }
    }

    async beforeExitEquipmentManagement() {
        await this.#initializeEquipmentPage();
        await Promise.all([
            new EquipmentSpaceTrigger(this.#credential)
                .withEquipmentPage(this.#equipmentPage)
                .triggerUpdate(),
            new BattleFieldTrigger(this.#credential)
                .triggerUpdate(),
            new EquipmentGrowthTrigger(this.#credential)
                .withEquipmentPage(this.#equipmentPage)
                .triggerUpdate()
        ]);
    }
}

export = EquipmentManagementReturnInterceptor;