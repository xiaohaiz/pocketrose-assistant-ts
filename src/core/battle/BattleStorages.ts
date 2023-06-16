import BattleLogStorage from "./BattleLogStorage";
import BattleRecordStorage from "./BattleRecordStorage";
import BattleResultStorage from "./BattleResultStorage";
import BattleSceneStorage from "./BattleSceneStorage";

const battleRecordStorage = new BattleRecordStorage();
const battleResultStorage = new BattleResultStorage();
const battleLogStore = new BattleLogStorage();
const battleSceneStorage = new BattleSceneStorage();

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

    static get battleSceneStorage() {
        return battleSceneStorage;
    }

}

export = BattleStorages;