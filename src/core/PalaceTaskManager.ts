import _ from "lodash";
import Credential from "../util/Credential";
import StorageUtils from "../util/StorageUtils";
import PetLocationLoader from "./PetLocationLoader";
import Pokemon from "./Pokemon";

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

    get monsterTaskHtml(): string {
        const json = this.#load();
        const s = json.monster;
        if (s === undefined) {
            return "";
        }
        const ss = _.split(s, "/");
        const a = ss[0];
        const b = ss[1];

        const s1 = Pokemon.pokemonWikiReplacement(a);
        const s2 = PetLocationLoader.getPetLocation(a);
        const s3 = b === "1" ? "已完成" : "进行中";

        return "杀怪任务：" + s1 + " (" + s2 + ") " + s3;
    }
}

export = PalaceTaskManager;