import BattleRecordStorage from "./BattleRecordStorage";

const storage = new BattleRecordStorage();

class BattleStorageManager {

    static getBattleRecordStorage() {
        return storage;
    }

}

export = BattleStorageManager;