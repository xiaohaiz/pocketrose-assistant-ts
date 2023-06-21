import BattleLogStorage from "./BattleLogStorage";
import BattleResultStorage from "./BattleResultStorage";

const battleResultStorage = new BattleResultStorage();
const battleLogStore = new BattleLogStorage();

/**
 * @deprecated
 */
class BattleStorages {

    static get battleResultStorage() {
        return battleResultStorage;
    }

    static get battleLogStore() {
        return battleLogStore;
    }

}

export = BattleStorages;