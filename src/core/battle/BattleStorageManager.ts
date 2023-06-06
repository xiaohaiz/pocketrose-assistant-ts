import BattleLogStorage from "./BattleLogStorage";
import BattleRecordStorage from "./BattleRecordStorage";
import BattleResultStorage from "./BattleResultStorage";

const battleRecordStorage = new BattleRecordStorage();
const battleResultStorage = new BattleResultStorage();
const battleLogStore = new BattleLogStorage();

class BattleStorageManager {

    static getBattleRecordStorage() {
        return battleRecordStorage;
    }

    static getBattleResultStorage() {
        return battleResultStorage;
    }

    static get battleLogStore() {
        return battleLogStore;
    }

}

export = BattleStorageManager;