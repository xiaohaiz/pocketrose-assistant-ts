import PocketDatabase from "../../core/PocketDatabase";
import PalaceTask from "./PalaceTask";

class PalaceTaskStorage {

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

    async updateMonsterTask(roleId: string, monsterName: string, complete?: boolean): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const flag: string = (complete !== undefined && complete) ? "1" : "0";
                this.load(roleId)
                    .then(task => {
                        let data = {};
                        if (task !== null) {
                            data = task.asObject();
                            // @ts-ignore
                            data.updateTime = new Date().getTime();
                            // @ts-ignore
                            data.monster = monsterName + "/" + flag;
                        } else {
                            data = {
                                id: roleId,
                                updateTime: new Date().getTime(),
                                monster: monsterName + "/" + flag
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

export = PalaceTaskStorage;