import Credential from "../../util/Credential";
import BattleFieldConfigWriter from "../battle/BattleFieldConfigWriter";
import BattlePage from "../battle/BattlePage";
import SetupLoader from "../config/SetupLoader";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import PersonalStatus from "../role/PersonalStatus";
import Role from "../role/Role";

class BattleFieldManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async autoSetBattleField() {
        const writer = new BattleFieldConfigWriter(this.#credential);
        if (this.#c1()) {
            await writer.writeCustomizedConfig(false, false, true, false);
            return;
        }

        const role = await new PersonalStatus(this.#credential).load();
        if (this.#c2(role)) {
            await writer.writeCustomizedConfig(false, false, true, false);
            return;
        }

        if (await this.#c3(role)) {
            await writer.writeCustomizedConfig(false, false, false, true);
            return;
        }

        if (this.#c4(role)) {
            await writer.writeCustomizedConfig(false, false, true, false);
            return;
        }

        if (this.#c5(role)) {
            await writer.writeCustomizedConfig(true, false, false, false);
            return;
        }

        if (this.#c6(role)) {
            await writer.writeCustomizedConfig(false, true, false, false);
            return;
        }

        await writer.writeCustomizedConfig(false, false, true, false);
    }

    // 当转职设置为允许时，战斗场所切换到上洞
    #c1(): boolean {
        return !SetupLoader.isCareerTransferEntranceDisabled(this.#credential.id);
    }

    // 当祭奠RP大于0时，战斗场所切换到上洞
    #c2(role: Role): boolean {
        const value = role.consecrateRP;
        return value !== undefined && value > 0;
    }

    // 当前位于枫丹并且自身和宠物都满级时，战斗场所切换到十二宫
    async #c3(role: Role): Promise<boolean> {
        const town = role.town;
        if (!town || town.name !== "枫丹") {
            return false;
        }
        const petList = (await new PersonalPetManagement(this.#credential).open()).petList;
        if (petList === undefined || petList.length === 0) {
            return false;
        }
        let usingMaxLevelPet = false;
        for (const pet of petList) {
            if (pet.using && pet.level !== undefined && pet.level === 100) {
                usingMaxLevelPet = true;
            }
        }
        return usingMaxLevelPet;
    }

    // 额外RP小于100时，战斗场所切换到上洞
    #c4(role: Role): boolean {
        const value = role.additionalRP;
        return value !== undefined && value < 100;
    }

    // 额外RP小于300时，战斗场所切换到初森
    #c5(role: Role): boolean {
        const value = role.additionalRP;
        return value !== undefined && value < 300;
    }

    // 额外RP小于500时，战斗场所切换到中塔
    #c6(role: Role): boolean {
        const value = role.additionalRP;
        return value !== undefined && value < 500;
    }


    /**
     * 战斗时如果获取了额外RP
     */
    async triggerBattleFieldChanged(battlePage: BattlePage) {
        if (this.#c1()) {
            // 当前允许转职，忽略根据RP判断
            return;
        }

        const additionalRP = battlePage.additionalRP;
        if (additionalRP === undefined) {
            // 本次战斗没有入手RP，忽略
            return;
        }

        const role = await new PersonalStatus(this.#credential).load();
        if (role.consecrateRP !== undefined && role.consecrateRP > 0) {
            // 当前有祭奠，忽略
            return;
        }

        const writer = new BattleFieldConfigWriter(this.#credential);
        if (additionalRP === 100) {
            await writer.writeCustomizedConfig(true, false, false, false);
        } else if (additionalRP === 300) {
            await writer.writeCustomizedConfig(false, true, false, false);
        } else if (additionalRP === 500) {
            await writer.writeCustomizedConfig(false, false, true, false);
        }
    }
}

export = BattleFieldManager;