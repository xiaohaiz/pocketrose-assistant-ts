import {PocketDatabase} from "../../pocket/PocketDatabase";
import StringUtils from "../../util/StringUtils";
import PalaceTask from "./PalaceTask";

class PalaceTaskStorage {

    static getInstance() {
        return instance;
    }

    async load(id: string): Promise<PalaceTask | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<PalaceTask | null>((resolve, reject) => {
                const request = db
                    .transaction(["PalaceTask"], "readonly")
                    .objectStore("PalaceTask")
                    .get(id);


                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const data = new PalaceTask();
                        data.id = request.result.id;
                        data.updateTime = request.result.updateTime;
                        data.monster = request.result.monster;
                        resolve(data);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }

    async updateMonsterTask(roleId: string, monsterName: string): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(roleId)
                    .then(task => {
                        let data: {};
                        if (task !== null) {
                            data = task.asObject();
                            // @ts-ignore
                            data.updateTime = new Date().getTime();
                            // @ts-ignore
                            data.monster = monsterName + "/0";
                        } else {
                            data = {
                                id: roleId,
                                updateTime: new Date().getTime(),
                                monster: monsterName + "/0"
                            };
                        }
                        const request = db
                            .transaction(["PalaceTask"], "readwrite")
                            .objectStore("PalaceTask")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    });
            });
        })();
    }

    async completeMonsterTask(roleId: string,): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(roleId)
                    .then(task => {
                        if (task !== null) {
                            const data = task.asObject();
                            // @ts-ignore
                            data.updateTime = new Date().getTime();
                            // @ts-ignore
                            const monster = data.monster;
                            const monsterName = StringUtils.substringBefore(monster, "/");
                            // @ts-ignore
                            data.monster = monsterName + "/1";

                            const request = db
                                .transaction(["PalaceTask"], "readwrite")
                                .objectStore("PalaceTask")
                                .put(data);
                            request.onerror = reject;
                            request.onsuccess = () => resolve();
                        }
                    });
            });
        })();
    }

    async finishMonsterTask(roleId: string): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(roleId)
                    .then(task => {
                        if (task !== null) {
                            const data = task.asObject();
                            // @ts-ignore
                            data.updateTime = new Date().getTime();
                            // @ts-ignore
                            delete data.monster;
                            const request = db
                                .transaction(["PalaceTask"], "readwrite")
                                .objectStore("PalaceTask")
                                .put(data);
                            request.onerror = reject;
                            request.onsuccess = () => resolve();
                        }
                    });
            });
        })();
    }

}

const instance = new PalaceTaskStorage();

export = PalaceTaskStorage;