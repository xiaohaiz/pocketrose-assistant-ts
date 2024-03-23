import Credential from "../../util/Credential";
import TownPetMapHouse from "../monster/TownPetMapHouse";
import RolePetMapStorage from "../monster/RolePetMapStorage";

/**
 * ============================================================================
 * 宠 物 图 鉴 状 态 触 发 器
 * ============================================================================
 */
class PetMapStatusTrigger {

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

export = PetMapStatusTrigger;