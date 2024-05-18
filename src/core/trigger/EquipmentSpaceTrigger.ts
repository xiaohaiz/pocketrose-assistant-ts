import Credential from "../../util/Credential";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import LocalSettingManager from "../../setup/LocalSettingManager";
import TownItemHousePage from "../store/TownItemHousePage";

/**
 * ============================================================================
 * 装 备 空 位 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 战斗入手（非图鉴）触发。
 * 2. 退出装备管理触发。
 * ============================================================================
 */
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

    itemHousePage?: TownItemHousePage;

    /**
     * equipmentPage is required.
     */
    async triggerUpdate() {
        let spaceCount: number;
        if (this.itemHousePage !== undefined) {
            spaceCount = 20 - this.itemHousePage.equipmentList!.length;
        } else {
            await this.#initializeEquipmentPage();
            spaceCount = this.equipmentPage!.spaceCount;
        }
        LocalSettingManager.setEquipmentCapacityMax(this.#credential.id, spaceCount <= 1);
    }

}

export = EquipmentSpaceTrigger;