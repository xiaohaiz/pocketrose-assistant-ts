import Credential from "../../util/Credential";
import LocalSettingManager from "../config/LocalSettingManager";
import SetupLoader from "../config/SetupLoader";
import EquipmentExperienceConfig from "../equipment/EquipmentExperienceConfig";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";

/**
 * ============================================================================
 * 智 能 战 斗 场 所 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 战斗定期触发，战数尾数：19/37/59/79/97。
 * 2. 退出装备管理触发。
 * ============================================================================
 */
class EquipmentGrowthTrigger {

    readonly #credential: Credential;
    #equipmentPage?: PersonalEquipmentManagementPage;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    withEquipmentPage(value: PersonalEquipmentManagementPage | undefined): EquipmentGrowthTrigger {
        this.#equipmentPage = value;
        return this;
    }

    async triggerUpdate() {
        const config = SetupLoader.loadEquipmentExperienceConfig(this.#credential.id);
        if (!config.configured) {
            // 用户压根就没有配置，忽略吧，关闭显示的开关。
            LocalSettingManager.setWeaponExperienceMax(this.#credential.id, false);
            LocalSettingManager.setArmorExperienceMax(this.#credential.id, false);
            LocalSettingManager.setAccessoryExperienceMax(this.#credential.id, false);
            return;
        }

        let page: PersonalEquipmentManagementPage | undefined = this.#equipmentPage;
        if (!page) {
            page = await new PersonalEquipmentManagement(this.#credential).open();
        }
        this.#processWeapon(config, page);
        this.#processArmor(config, page);
        this.#processAccessory(config, page);
    }

    #processWeapon(config: EquipmentExperienceConfig, page: PersonalEquipmentManagementPage) {
        if (!config.weapon!) {
            LocalSettingManager.setWeaponExperienceMax(this.#credential.id, false);
            return;
        }
        const usingWeapon = page.usingWeapon;
        if (!usingWeapon) {
            LocalSettingManager.setWeaponExperienceMax(this.#credential.id, false);
            return;
        }
        const ratio = usingWeapon.fullExperienceRatio;
        if (ratio === 1) {
            LocalSettingManager.setWeaponExperienceMax(this.#credential.id, true);
        } else {
            LocalSettingManager.setWeaponExperienceMax(this.#credential.id, false);
        }
    }

    #processArmor(config: EquipmentExperienceConfig, page: PersonalEquipmentManagementPage) {
        if (!config.armor!) {
            LocalSettingManager.setArmorExperienceMax(this.#credential.id, false);
            return;
        }
        const usingArmor = page.usingArmor;
        if (!usingArmor) {
            LocalSettingManager.setArmorExperienceMax(this.#credential.id, false);
            return;
        }
        const ratio = usingArmor.fullExperienceRatio;
        if (ratio === 1) {
            LocalSettingManager.setArmorExperienceMax(this.#credential.id, true);
        } else {
            LocalSettingManager.setArmorExperienceMax(this.#credential.id, false);
        }
    }

    #processAccessory(config: EquipmentExperienceConfig, page: PersonalEquipmentManagementPage) {
        if (!config.accessory!) {
            LocalSettingManager.setAccessoryExperienceMax(this.#credential.id, false);
            return;
        }
        const usingAccessory = page.usingAccessory;
        if (!usingAccessory) {
            LocalSettingManager.setAccessoryExperienceMax(this.#credential.id, false);
            return;
        }
        const ratio = usingAccessory.fullExperienceRatio;
        if (ratio === 1) {
            LocalSettingManager.setAccessoryExperienceMax(this.#credential.id, true);
        } else {
            LocalSettingManager.setAccessoryExperienceMax(this.#credential.id, false);
        }
    }

}

export = EquipmentGrowthTrigger;