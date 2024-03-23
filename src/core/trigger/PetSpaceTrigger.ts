import Credential from "../../util/Credential";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import LocalSettingManager from "../config/LocalSettingManager";

/**
 * ============================================================================
 * 宠 物 空 位 状 态 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 非十二宫战斗有入手时触发。
 * 3. 退出城市宠物管理时触发。
 * ============================================================================
 */
class PetSpaceTrigger {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #petPage?: PersonalPetManagementPage;

    get petPage(): PersonalPetManagementPage | undefined {
        return this.#petPage;
    }

    withPetPage(value: PersonalPetManagementPage | undefined): PetSpaceTrigger {
        this.#petPage = value;
        return this;
    }

    async #initializePetPage() {
        if (!this.#petPage) {
            this.#petPage = await new PersonalPetManagement(this.#credential).open();
        }
    }

    async triggerUpdate() {
        await this.#initializePetPage();
        const petCount = this.petPage!.petList!.length;
        LocalSettingManager.setPetCapacityMax(this.#credential.id, (petCount === 3));
    }
}

export = PetSpaceTrigger;