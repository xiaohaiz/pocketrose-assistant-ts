import Credential from "../../util/Credential";
import SetupLoader from "../../setup/SetupLoader";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import {PersonalStatus} from "../role/PersonalStatus";
import Role from "../role/Role";
import BattleFieldThreshold from "../battle/BattleFieldThreshold";
import BattlePage from "../battle/BattlePage";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";
import {RoleStatusManager} from "../role/RoleStatus";
import {BattleConfigManager} from "../../setup/ConfigManager";
import PalaceTaskStorage from "../task/PalaceTaskStorage";
import MonsterProfileLoader from "../monster/MonsterProfileLoader";

/**
 * ============================================================================
 * 智 能 战 斗 场 所 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 战斗触发。
 * 2. 退出装备管理触发。
 * 3. 退出宠物管理触发。
 * 4. 城市页面刷新触发。
 * ============================================================================
 */
class BattleFieldTrigger {

    private readonly credential: Credential;
    private readonly configManager: BattleConfigManager;
    private readonly statusManager: RoleStatusManager;

    constructor(credential: Credential) {
        this.credential = credential;
        this.configManager = new BattleConfigManager(credential);
        this.statusManager = new RoleStatusManager(credential);
    }

    #role?: Role;
    #petPage?: PersonalPetManagementPage;

    withRole(value: Role | undefined): BattleFieldTrigger {
        this.#role = value;
        return this;
    }

    async #initializeRole() {
        if (!this.#role) {
            this.#role = await new PersonalStatus(this.credential).load();
        }
    }

    withPetPage(value: PersonalPetManagementPage | undefined): BattleFieldTrigger {
        this.#petPage = value;
        return this;
    }

    async #initializePetPage() {
        if (!this.#petPage) {
            this.#petPage = await new PersonalPetManagement(this.credential).open();
        }
    }

    /**
     * role is optional.
     * petPage is optional.
     */
    async triggerUpdate() {
        if (BattleConfigManager.loadGlobalBattleFieldConfig().configured) {
            return;
        }

        if (!(this.configManager.isAutoSetBattleFieldEnabled)) {
            return;
        }

        if (await this.checkConsecrate()) {
            this.configManager.setPersonalBattleFieldConfig(false, false, true, false);
            return;
        }

        if (await this.checkPalaceTask()) {
            return;
        }

        if (await this.checkZodiacBattle()) {
            this.configManager.setPersonalBattleFieldConfig(false, false, false, true);
            return;
        }

        let additionalRP = (await this.statusManager.load())?.readAdditionalRP;
        if (additionalRP === undefined) {
            await this.#initializeRole();
            additionalRP = this.#role?.additionalRP;
        }
        const config = SetupLoader.loadBattleFieldThreshold();
        if (config.forceSenior) {
            let mirrorIndex = (await this.statusManager.load())?.mirrorIndex;
            if (mirrorIndex === undefined) {
                await this.#initializeRole();
                mirrorIndex = this.#role!.mirrorIndex!;
            }
            if (!SetupLoader.isCareerFixed(this.credential.id, mirrorIndex)) {
                this.configManager.setPersonalBattleFieldConfig(false, false, true, false);
                return;
            }
        }
        if (await this.checkAdditionalRP_1(additionalRP, config)) {
            this.configManager.setPersonalBattleFieldConfig(false, false, true, false);
            return;
        }
        if (await this.checkAdditionalRP_2(additionalRP, config)) {
            this.configManager.setPersonalBattleFieldConfig(true, false, false, false);
            return;
        }
        if (await this.checkAdditionalRP_3(additionalRP, config)) {
            this.configManager.setPersonalBattleFieldConfig(false, true, false, false);
            return;
        }

        this.configManager.setPersonalBattleFieldConfig(false, false, true, false);
    }

    // 当祭奠RP大于0时，战斗场所切换到上洞
    private async checkConsecrate(): Promise<boolean> {
        let consecrateRP = (await this.statusManager.load())?.readConsecrateRP;
        if (consecrateRP === undefined) {
            await this.#initializeRole();
            consecrateRP = this.#role!.consecrateRP!;
        }
        return consecrateRP > 0;
    }

    private async checkPalaceTask() {
        const task = await PalaceTaskStorage.getInstance().load(this.credential.id);
        if (task === null) return false;
        if (task.monster === undefined) return false;
        const monster = MonsterProfileLoader.load(task.monster);
        if (monster === null) return false;
        switch (monster.locationText) {
            case "初森": {
                this.configManager.setPersonalBattleFieldConfig(true, false, false, false);
                return true;
            }
            case "中塔": {
                this.configManager.setPersonalBattleFieldConfig(false, true, false, false);
                return true;
            }
            case "上洞": {
                this.configManager.setPersonalBattleFieldConfig(false, false, true, false);
                return true;
            }
            default: {
                return false;
            }
        }
    }

    // 当前位于枫丹并且自身和宠物都满级时，战斗场所切换到十二宫
    private async checkZodiacBattle(): Promise<boolean> {
        // 当前角色满级
        let roleLevel = (await this.statusManager.load())?.readLevel;
        if (roleLevel === undefined) {
            await this.#initializeRole();
            roleLevel = this.#role?.level;
        }
        if (roleLevel === undefined || roleLevel !== 150) {
            return false;
        }

        // 当前城市是枫丹
        let roleTownId = (await this.statusManager.load())?.readTownId;
        if (roleTownId === undefined) {
            await this.#initializeRole();
            roleTownId = this.#role?.town?.id;
        }
        if (roleTownId === undefined || roleTownId !== "12") {
            return false;
        }

        // 宠物必须满级
        let petLevel = (await this.statusManager.load())?.readPetLevel;
        if (petLevel === undefined) {
            await this.#initializePetPage();
            petLevel = this.#petPage?.usingPet?.level;
        }
        return petLevel !== undefined && petLevel === 100;
    }

    // 额外RP小于100时，战斗场所切换到上洞
    private async checkAdditionalRP_1(additionalRP: number | undefined, config: BattleFieldThreshold): Promise<boolean> {
        return additionalRP !== undefined && additionalRP < config.a!;
    }

    // 额外RP小于300时，战斗场所切换到初森
    private async checkAdditionalRP_2(additionalRP: number | undefined, config: BattleFieldThreshold): Promise<boolean> {
        return additionalRP !== undefined && additionalRP < config.b!;
    }

    // 额外RP小于500时，战斗场所切换到中塔
    private async checkAdditionalRP_3(additionalRP: number | undefined, config: BattleFieldThreshold): Promise<boolean> {
        return additionalRP !== undefined && additionalRP < config.c!;
    }


    /**
     * 战斗时如果获取了额外RP
     * role is optional.
     * petPage is unnecessary.
     */
    async triggerUpdateWhenBattle(battlePage: BattlePage) {
        if (battlePage.zodiacBattle) {
            // 当前在十二宫战斗，忽略
            return;
        }

        const additionalRP = battlePage.additionalRP;
        if (additionalRP === undefined) {
            // 本次战斗没有入手RP，忽略
            return;
        }

        if (BattleConfigManager.loadGlobalBattleFieldConfig().configured) {
            // 全局设置已经开始，忽略
            return;
        }

        if (!this.configManager.isAutoSetBattleFieldEnabled) {
            // 功能未开启，忽略
            return;
        }

        let consecrateRP = (await this.statusManager.load())?.readConsecrateRP;
        if (consecrateRP === undefined) {
            await this.#initializeRole();
            consecrateRP = this.#role!.consecrateRP;
        }
        if (consecrateRP !== undefined && consecrateRP > 0) {
            // 当前有祭奠，确保切换到上洞
            this.configManager.setPersonalBattleFieldConfig(false, false, true, false);
            return;
        }

        const palaceTask = await PalaceTaskStorage.getInstance().load(this.credential.id);
        if (palaceTask !== null && palaceTask.monster !== undefined) {
            // 当前有皇宫任务，忽略
            return;
        }

        const config = SetupLoader.loadBattleFieldThreshold();
        if (config.forceSenior) {
            let mirrorIndex = (await this.statusManager.load())?.mirrorIndex;
            if (mirrorIndex === undefined) {
                await this.#initializeRole();
                mirrorIndex = this.#role!.mirrorIndex!;
            }
            if (!SetupLoader.isCareerFixed(this.credential.id, mirrorIndex)) {
                this.configManager.setPersonalBattleFieldConfig(false, false, true, false);
                return;
            }
        }
        if (additionalRP === config.a!) {
            this.configManager.setPersonalBattleFieldConfig(true, false, false, false);
        } else if (additionalRP === config.b!) {
            this.configManager.setPersonalBattleFieldConfig(false, true, false, false);
        } else if (additionalRP === config.c!) {
            this.configManager.setPersonalBattleFieldConfig(false, false, true, false);
        }
    }

}

export = BattleFieldTrigger;