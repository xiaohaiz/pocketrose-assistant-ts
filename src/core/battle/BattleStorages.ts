import BattleLogStorage from "./BattleLogStorage";

const battleLogStore = new BattleLogStorage();

/**
 * @deprecated
 */
class BattleStorages {

    static get battleLogStore() {
        return battleLogStore;
    }

}

export = BattleStorages;