import Credential from "../../util/Credential";
import TownPetMapHouse from "../monster/TownPetMapHouse";
import RolePetMapStorage from "../monster/RolePetMapStorage";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("PET");

/**
 * ============================================================================
 * 宠 物 图 鉴 状 态 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 定期战斗后触发，战数尾数83。
 * 2. 战斗中图鉴入手触发。
 * ----------------------------------------------------------------------------
 * 统计用，非实时需求。
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
    async triggerUpdate() {
        const page = await new TownPetMapHouse(this.#credential).open();
        const json = page.asJson();
        await RolePetMapStorage.getInstance().write(this.#credential.id, json);
        logger.debug("Pet portrait record saved.");
    }
}

export = PetMapStatusTrigger;