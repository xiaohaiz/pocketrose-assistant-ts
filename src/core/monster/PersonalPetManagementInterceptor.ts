import Credential from "../../util/Credential";
import PersonalPetManagement from "./PersonalPetManagement";
import LocalSettingManager from "../config/LocalSettingManager";

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

        const usingPet = page.usingPet;
        if (usingPet && usingPet.level === 100) {

        }
    }
}

export = PersonalPetManagementInterceptor;