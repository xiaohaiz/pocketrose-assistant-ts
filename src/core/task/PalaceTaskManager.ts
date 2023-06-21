import _ from "lodash";
import Credential from "../../util/Credential";
import MonsterProfileDict from "../monster/MonsterProfileDict";
import PalaceTaskStorage from "./PalaceTaskStorage";

class PalaceTaskManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async updateMonsterTask(monsterName: string): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                PalaceTaskStorage.getInstance()
                    .updateMonsterTask(this.#credential.id, monsterName)
                    .then(() => resolve());
            });
        })();
    }

    async completeMonsterTask(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                PalaceTaskStorage.getInstance()
                    .completeMonsterTask(this.#credential.id)
                    .then(() => resolve());
            });
        })();
    }


    async finishMonsterTask(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                PalaceTaskStorage.getInstance()
                    .finishMonsterTask(this.#credential.id)
                    .then(() => resolve());
            });
        })();
    }

    async monsterTaskHtml(): Promise<string> {
        return await (() => {
            return new Promise<string>(resolve => {
                PalaceTaskStorage.getInstance()
                    .load(this.#credential.id)
                    .then(task => {
                        if (task === null) {
                            resolve("");
                            return;
                        }
                        if (task.monster === undefined) {
                            resolve("");
                            return;
                        }

                        const ss = _.split(task.monster, "/");
                        const a = ss[0];
                        const b = ss[1];

                        const profile = MonsterProfileDict.load(a)!;
                        const s1: string = profile.nameHtml!;
                        const s2: string = profile.locationText!;
                        const s3: string = b === "1" ? "<span style='color:blue'>已完成</span>" : "进行中";

                        const html = "杀怪任务：" + s1 + " (" + s2 + ") " + s3;
                        resolve(html);
                    });
            });
        })();
    }
}

export = PalaceTaskManager;