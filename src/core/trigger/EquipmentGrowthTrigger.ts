import Credential from "../../util/Credential";
import LocalSettingManager from "../../setup/LocalSettingManager";
import SetupLoader from "../../setup/SetupLoader";
import EquipmentExperienceConfig from "../equipment/EquipmentExperienceConfig";
import PersonalEquipmentManagement from "../equipment/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../equipment/PersonalEquipmentManagementPage";

/**
 * ============================================================================
 * 装 备 满 级 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 战斗定期触发，战数尾数：19/37/59/79/97。
 * 2. 退出装备管理触发。
 * ============================================================================
 */
class EquipmentGrowthTrigger {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #equipmentPage?: PersonalEquipmentManagementPage;

    get equipmentPage(): PersonalEquipmentManagementPage | undefined {
        return this.#equipmentPage;
    }

    withEquipmentPage(value: PersonalEquipmentManagementPage | undefined): EquipmentGrowthTrigger {
        this.#equipmentPage = value;
        return this;
    }

    async #initializeEquipmentPage() {
        if (!this.#equipmentPage) {
            this.#equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        }
    }

    /**
     * 使用当前装备页面的状态来更新练装备经验的记录。
     */
    async triggerUpdateExperienceConfig() {
        await this.#initializeEquipmentPage();

        // 更新练装备的状态位
        const config = new EquipmentExperienceConfig();
        config.weapon = (this.equipmentPage?.usingWeapon?.calculateRemainingExperience() ?? 0) > 0;
        config.armor = (this.equipmentPage?.usingArmor?.calculateRemainingExperience() ?? 0) > 0;
        config.accessory = (this.equipmentPage?.usingAccessory?.calculateRemainingExperience() ?? 0) > 0;
        EquipmentExperienceConfig.writeConfig(this.#credential.id, config);

        // 清除提醒标志位
        LocalSettingManager.setWeaponExperienceMax(this.#credential.id, false);
        LocalSettingManager.setArmorExperienceMax(this.#credential.id, false);
        LocalSettingManager.setAccessoryExperienceMax(this.#credential.id, false);
    }

    /**
     * 战斗触发，根据配置检查是否需要设置提醒标志位。
     */
    async triggerUpdateEquipmentGrowth() {
        await this.#initializeEquipmentPage();

        const config = SetupLoader.loadEquipmentExperienceConfig(this.#credential.id);
        if (config.weapon) {
            const remaining = this.equipmentPage?.usingWeapon?.calculateRemainingExperience() ?? 0;
            if (remaining === 0) {
                LocalSettingManager.setWeaponExperienceMax(this.#credential.id, true);
            }
        }
        if (config.armor) {
            const remaining = this.equipmentPage?.usingArmor?.calculateRemainingExperience() ?? 0;
            if (remaining === 0) {
                LocalSettingManager.setArmorExperienceMax(this.#credential.id, true);
            }
        }
        if (config.accessory) {
            const remaining = this.equipmentPage?.usingAccessory?.calculateRemainingExperience() ?? 0;
            if (remaining === 0) {
                LocalSettingManager.setAccessoryExperienceMax(this.#credential.id, true);
            }
        }
    }

}

export = EquipmentGrowthTrigger;