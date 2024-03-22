import Credential from "../../util/Credential";
import SetupLoader from "../config/SetupLoader";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import PersonalStatus from "../role/PersonalStatus";
import Role from "../role/Role";
import BattleFieldConfigLoader from "./BattleFieldConfigLoader";
import BattleFieldConfigWriter from "./BattleFieldConfigWriter";
import BattleFieldThreshold from "./BattleFieldThreshold";
import BattlePage from "./BattlePage";

class BattleFieldManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    // maxLevelPet : 当前是否使用满级宠物，undefined时需要自己获取数据。
    async autoSetBattleField(usingMaxLevelPet?: boolean): Promise<string | undefined> {
        if (!SetupLoader.isAutoSetBattleFieldEnabled()) {
            return undefined;
        }
        const writer = new BattleFieldConfigWriter(this.#credential);
        if (this.#c1()) {
            await writer.writeCustomizedConfig(false, false, true, false);
            return "上洞";
        }

        const role = await new PersonalStatus(this.#credential).load();
        if (this.#c2(role)) {
            await writer.writeCustomizedConfig(false, false, true, false);
            return "上洞";
        }

        if (await this.#c3(role, usingMaxLevelPet)) {
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
    async #c3(role: Role, usingMaxLevelPet?: boolean): Promise<boolean> {
        if (role.level === undefined || role.level !== 150) {
            return false;
        }
        const town = role.town;
        if (!town || town.name !== "枫丹") {
            return false;
        }
        if (usingMaxLevelPet !== undefined) {
            // 外部已经传入了是否正在使用满级宠物的信息，无需额外获取了
            return usingMaxLevelPet;
        }
        const petList = (await new PersonalPetManagement(this.#credential).open()).petList;
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
    async triggerBattleFieldChanged(battlePage: BattlePage) {
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

export = BattleFieldManager;