import _ from "lodash";
import Credential from "../util/Credential";
import StorageUtils from "../util/StorageUtils";

class PalaceTaskManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #key() {
        return "_pt_" + this.#credential.id;
    }

    #load() {
        const value = StorageUtils.getString(this.#key());
        return value === "" ? {} : JSON.parse(value);
    }

    #save(json: {}) {
        StorageUtils.set(this.#key(), JSON.stringify(json));
    }

    createMonsterTask(monsterName: string) {
        const json = this.#load();
        json.monster = monsterName + "/0";
        this.#save(json);
    }

    updateMonsterTask(monsterName: string) {
        const json = this.#load();
        const s = json.monster;
        if (s === undefined || !_.startsWith(s, monsterName + "/")) {
            json.monster = monsterName + "/0";
            this.#save(json);
        }
    }

    finishMonsterTask() {
        const json = this.#load();
        const s = json.monster;
        if (s !== undefined && !_.endsWith(s, "/1")) {
            const monsterName = _.split(s, "/")[0];
            json.monster = monsterName + "/1";
            this.#save(json);
        }
    }

    completeMonsterTask() {
        const json = this.#load();
        const s = json.monster;
        if (s !== undefined) {
            delete json.monster;
            this.#save(json);
        }
    }
}

export = PalaceTaskManager;