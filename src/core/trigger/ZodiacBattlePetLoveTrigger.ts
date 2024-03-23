import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import TownBank from "../bank/TownBank";
import BattlePage from "../battle/BattlePage";
import SetupLoader from "../config/SetupLoader";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import Pet from "../monster/Pet";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";

/**
 * ============================================================================
 * 十 二 宫 战 斗 宠 物 亲 密 度 触 发 器
 * ----------------------------------------------------------------------------
 * 十二宫战斗后自动触发，如果宠物亲密度低于指定的阈值，自动补满。
 * ============================================================================
 */
class ZodiacBattlePetLoveTrigger {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #petPage?: PersonalPetManagementPage;

    withPetPage(value: PersonalPetManagementPage | undefined): ZodiacBattlePetLoveTrigger {
        this.#petPage = value;
        return this;
    }

    async #initializePetPage() {
        if (!this.#petPage) {
            this.#petPage = await new PersonalPetManagement(this.#credential).open();
        }
    }

    async triggerPetLoveFixed(battlePage: BattlePage) {
        if (!battlePage.zodiacBattle) {
            // 不是十二宫的战斗，忽略
            return;
        }
        if (!battlePage.petLove) {
            // 没有宠物亲密度数据，大概率是忘记带宠物了，糊涂蛋也不是没有，忽略
            return;
        }
        if (battlePage.petLove >= 95) {
            // 宠物的亲密度还够，忽略
            return;
        }
        if (!SetupLoader.isZodiacBattlePetLoveAutoFixEnabled()) {
            // 没有开启配置，忽略
            return;
        }
        await this.#fixPetLove();
    }

    async #fixPetLove() {
        await this.#initializePetPage();
        if (!this.#petPage!.petList || this.#petPage!.petList.length === 0) {
            return;
        }
        let usingPet: Pet | null = null;
        for (const pet of this.#petPage!.petList) {
            if (pet.using) {
                usingPet = pet;
                break;
            }
        }
        if (!usingPet || usingPet.level !== 100) {
            // 不是满级宠物，凑什么乱呀，忽略
            return;
        }
        if (usingPet.love === 100) {
            // 宠物亲密度已经满了，忽略
            return;
        }

        // 取钱，补满宠物亲密度
        const amount = Math.ceil(100 - usingPet.love!);
        await new TownBank(this.#credential).withdraw(amount);
        await this.#addLove(usingPet.index!);
    }

    async #addLove(index: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("select", index.toString());
                request.set("mode", "PETADDLOVE");
                NetworkUtils.post("mydata.cgi", request).then(() => resolve());
            });
        })();
    }
}

export = ZodiacBattlePetLoveTrigger;