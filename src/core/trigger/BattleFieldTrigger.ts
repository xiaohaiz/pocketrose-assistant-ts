import Credential from "../../util/Credential";
import SetupLoader from "../config/SetupLoader";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import PersonalStatus from "../role/PersonalStatus";
import Role from "../role/Role";
import BattleFieldConfigLoader from "../battle/BattleFieldConfigLoader";
import BattleFieldConfigWriter from "../battle/BattleFieldConfigWriter";
import BattleFieldThreshold from "../battle/BattleFieldThreshold";
import BattlePage from "../battle/BattlePage";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";

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

    readonly #credential: Credential;

    #role?: Role;
    #petPage?: PersonalPetManagementPage;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    withRole(value: Role | undefined): BattleFieldTrigger {
        this.#role = value;
        return this;
    }

    withPetPage(value: PersonalPetManagementPage | undefined): BattleFieldTrigger {
        this.#petPage = value;
        return this;
    }

    async triggerUpdate(): Promise<string | undefined> {
        if (!SetupLoader.isAutoSetBattleFieldEnabled()) {
            return undefined;
        }
        const writer = new BattleFieldConfigWriter(this.#credential);
        if (this.#c1()) {
            await writer.writeCustomizedConfig(false, false, true, false);
            return "上洞";
        }

        let role: Role | undefined = this.#role;
        if (!role) {
            role = await new PersonalStatus(this.#credential).load();
        }
        if (this.#c2(role)) {
            await writer.writeCustomizedConfig(false, false, true, false);
            return "上洞";
        }

        if (await this.#c3(role)) {
            await writer.writeCustomizedConfig(false, false, false, true);
            return "十二宫";
        }

        const config = SetupLoader.loadBattleFieldThreshold();

        if (this.#c4(role, config)) {
            await writer.writeCustomizedConfig(false, false, true, false);
            return "上洞";
        }

        if (this.#c5(role, config)) {
            await writer.writeCustomizedConfig(true, false, false, false);
            return "初森";
        }

        if (this.#c6(role, config)) {
            await writer.writeCustomizedConfig(false, true, false, false);
            return "中塔";
        }

        await writer.writeCustomizedConfig(false, false, true, false);
        return "上洞";
    }

    // 当锁死上洞时，战斗场所切换到上洞
    #c1(): boolean {
        return SetupLoader.isForceSeniorBattleEnabled(this.#credential.id);
    }

    // 当祭奠RP大于0时，战斗场所切换到上洞
    #c2(role: Role): boolean {
        const value = role.consecrateRP;
        return value !== undefined && value > 0;
    }

    // 当前位于枫丹并且自身和宠物都满级时，战斗场所切换到十二宫
    async #c3(role: Role): Promise<boolean> {
        if (role.level === undefined || role.level !== 150) {
            return false;
        }
        const town = role.town;
        if (!town || town.name !== "枫丹") {
            return false;
        }

        let page: PersonalPetManagementPage | undefined = this.#petPage;
        if (!page) {
            page = await new PersonalPetManagement(this.#credential).open();
        }
        const petList = page.petList;
        if (petList === undefined || petList.length === 0) {
            return false;
        }
        let value = false;
        for (const pet of petList) {
            if (pet.using && pet.level !== undefined && pet.level === 100) {
                value = true;
            }
        }
        return value;
    }

    // 额外RP小于100时，战斗场所切换到上洞
    #c4(role: Role, config: BattleFieldThreshold): boolean {
        const value = role.additionalRP;
        return value !== undefined && value < config.a!;
    }

    // 额外RP小于300时，战斗场所切换到初森
    #c5(role: Role, config: BattleFieldThreshold): boolean {
        const value = role.additionalRP;
        return value !== undefined && value < config.b!;
    }

    // 额外RP小于500时，战斗场所切换到中塔
    #c6(role: Role, config: BattleFieldThreshold): boolean {
        const value = role.additionalRP;
        return value !== undefined && value < config.c!;
    }


    /**
     * 战斗时如果获取了额外RP
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

        if (!BattleFieldConfigLoader.isAutoSetEnabled()) {
            // 功能未开启，忽略
            return;
        }
        if (this.#c1()) {
            // 当前允许转职，忽略根据RP判断
            return;
        }

        const role = await new PersonalStatus(this.#credential).load();
        if (role.consecrateRP !== undefined && role.consecrateRP > 0) {
            // 当前有祭奠，忽略
            return;
        }

        const config = SetupLoader.loadBattleFieldThreshold();
        const writer = new BattleFieldConfigWriter(this.#credential);
        if (additionalRP === config.a!) {
            await writer.writeCustomizedConfig(true, false, false, false);
        } else if (additionalRP === config.b!) {
            await writer.writeCustomizedConfig(false, true, false, false);
        } else if (additionalRP === config.c!) {
            await writer.writeCustomizedConfig(false, false, true, false);
        }
    }
}

export = BattleFieldTrigger;