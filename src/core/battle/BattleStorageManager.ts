import BattleRecordStorage from "./BattleRecordStorage";
import BattleResultStorage from "./BattleResultStorage";

const battleRecordStorage = new BattleRecordStorage();
const battleResultStorage = new BattleResultStorage();

class BattleStorageManager {

    static getBattleRecordStorage() {
        return battleRecordStorage;
    }

    static getBattleResultStorage() {
        return battleResultStorage;
    }

}

export = BattleStorageManager;