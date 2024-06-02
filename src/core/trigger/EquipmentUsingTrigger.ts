import Credential from "../../util/Credential";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import {RoleUsingEquipment, RoleUsingEquipmentManager} from "../role/RoleUsingEquipment";
import _ from "lodash";
import BattlePage from "../battle/BattlePage";

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
        await new RoleUsingEquipmentManager(this.#credential.id).write(data);
    }

    async triggerUpdateFromBattlePage(battlePage: BattlePage) {
        const data = new RoleUsingEquipment();
        data.id = this.#credential.id;
        (battlePage.usingWeaponName) && (data.usingWeapon = battlePage.usingWeaponName);
        (battlePage.usingArmorName) && (data.usingArmor = battlePage.usingArmorName);
        (battlePage.usingAccessoryName) && (data.usingAccessory = battlePage.usingAccessoryName);
        await new RoleUsingEquipmentManager(this.#credential.id).write(data);
    }
}

export = EquipmentUsingTrigger;