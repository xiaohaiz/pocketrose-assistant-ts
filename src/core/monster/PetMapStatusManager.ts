import Credential from "../../util/Credential";
import TownPetMapHouse from "./TownPetMapHouse";
import RolePetMapStorage from "./RolePetMapStorage";

/**
 * ============================================================================
 * 宠物图鉴状态更新管理器。
 * ============================================================================
 */
class PetMapStatusManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    /**
     * 更新宠物图鉴状态。
     */
    async updatePetMapStatus() {
        const page = await new TownPetMapHouse(this.#credential).open();
        const json = page.asJson();
        await RolePetMapStorage.getInstance().write(this.#credential.id, json);
    }
}

export = PetMapStatusManager;