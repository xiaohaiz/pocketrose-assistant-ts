import Credential from "../../util/Credential";
import BattlePage from "../battle/BattlePage";

/**
 * 十二宫战斗后，如果宠物亲密度低于指定的阈值，自动补满。
 */
class RolePetLoveManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async triggerPetLoveFixed(battlePage: BattlePage) {
    }

}

export = RolePetLoveManager;