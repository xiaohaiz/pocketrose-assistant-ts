import Credential from "../../util/Credential";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import RoleUsingEquipment from "../role/RoleUsingEquipment";
import _ from "lodash";
import RoleUsingEquipmentStorage from "../role/RoleUsingEquipmentStorage";

/**
 * ============================================================================
 * 装 备 当 前 使 用 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 退出装备管理触发。
 * ============================================================================
 */
class EquipmentUsingTrigger {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #equipmentPage?: PersonalEquipmentManagementPage;

    withEquipmentPage(value: PersonalEquipmentManagementPage | undefined): EquipmentUsingTrigger {
        this.#equipmentPage = value;
        return this;
    }

    async #initializeEquipmentPage() {
        if (!this.#equipmentPage) {
            this.#equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        }
    }

    /**
     * equipmentPage is required.
     */
    async triggerUpdate() {
        await this.#initializeEquipmentPage();
        const data = new RoleUsingEquipment();
        data.id = this.#credential.id;
        data.updateTime = new Date().getTime();
        _.forEach(this.#equipmentPage!.equipmentList!)
            .filter(it => it.using)
            .forEach(it => {
                if (it.isWeapon) {
                    data.usingWeapon = it.fullName;
                } else if (it.isArmor) {
                    data.usingArmor = it.fullName;
                } else if (it.isAccessory) {
                    data.usingAccessory = it.fullName;
                }
            });
        await RoleUsingEquipmentStorage.write(data);
    }
}

export = EquipmentUsingTrigger;