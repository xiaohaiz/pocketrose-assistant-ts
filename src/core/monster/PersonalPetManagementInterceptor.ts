import Credential from "../../util/Credential";
import PersonalPetManagement from "./PersonalPetManagement";
import LocalSettingManager from "../config/LocalSettingManager";
import BattleFieldManager from "../battle/BattleFieldManager";

class PersonalPetManagementInterceptor {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async beforeExitPersonalPetManagement() {
        const page = await new PersonalPetManagement(this.#credential).open();
        if (!page.petList) return;
        const petCount = page.petList.length;
        // 设置宠物是否满位的标记
        LocalSettingManager.setPetCapacityMax(this.#credential.id, (petCount === 3));

        // 宠物状态有可能发生改变，有可能触发智能战斗场所切换
        await new BattleFieldManager(this.#credential).withPetPage(page).autoSetBattleField();
    }
}

export = PersonalPetManagementInterceptor;