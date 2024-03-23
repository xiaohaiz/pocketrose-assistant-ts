import Credential from "../../util/Credential";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import LocalSettingManager from "../config/LocalSettingManager";

class EquipmentSpaceTrigger {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #equipmentPage?: PersonalEquipmentManagementPage;

    get equipmentPage(): PersonalEquipmentManagementPage | undefined {
        return this.#equipmentPage;
    }

    withEquipmentPage(value: PersonalEquipmentManagementPage | undefined): EquipmentSpaceTrigger {
        this.#equipmentPage = value;
        return this;
    }

    async #initializeEquipmentPage() {
        if (!this.#equipmentPage) {
            this.#equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        }
    }

    async updateEquipmentSpace() {
        await this.#initializeEquipmentPage();
        const spaceCount = this.equipmentPage!.spaceCount;
        LocalSettingManager.setEquipmentCapacityMax(this.#credential.id, spaceCount <= 1);
    }

}

export = EquipmentSpaceTrigger;