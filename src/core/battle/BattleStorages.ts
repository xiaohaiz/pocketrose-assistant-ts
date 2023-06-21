import BattleLogStorage from "./BattleLogStorage";
import BattleRecordStorage from "./BattleRecordStorage";
import BattleResultStorage from "./BattleResultStorage";

const battleRecordStorage = new BattleRecordStorage();
const battleResultStorage = new BattleResultStorage();
const battleLogStore = new BattleLogStorage();

/**
 * @deprecated
 */
class BattleStorages {

    static getBattleRecordStorage() {
        return battleRecordStorage;
    }

    static get battleResultStorage() {
        return battleResultStorage;
    }

    static get battleLogStore() {
        return battleLogStore;
    }

}

export = BattleStorages;