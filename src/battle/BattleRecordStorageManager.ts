import BattleRecordStorage from "./BattleRecordStorage";

const storage = new BattleRecordStorage();

class BattleRecordStorageManager {

    static storage() {
        return storage;
    }

}

export = BattleRecordStorageManager;