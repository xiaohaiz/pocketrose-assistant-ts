import Constants from "../util/Constants";
import BattleResult from "./BattleResult";

class BattleResultStorage {

    readonly #connectDB = () => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = window.indexedDB.open(Constants.DATABASE_NAME);

            request.onerror = reject;

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onupgradeneeded = event => {
                // @ts-ignore
                const db: IDBDatabase = event.target.result;

                if (!db.objectStoreNames.contains("BattleResult")) {
                    const store = db.createObjectStore("BattleResult", {
                        keyPath: "id", autoIncrement: false
                    });
                    store.createIndex("roleId", "roleId", {
                        unique: false
                    });
                    store.createIndex("monster", "monster", {
                        unique: false
                    });
                }
            };
        });
    };

    async load(id: string, monster: string): Promise<BattleResult> {
        const db = await this.#connectDB();
        return await (() => {
            return new Promise<BattleResult>((resolve, reject) => {

                const request = db.transaction(["BattleResult"], "readonly")
                    .objectStore("BattleResult")
                    .get(id);


                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const result = new BattleResult();
                        result.id = request.result.id;
                        result.roleId = request.result.roleId;
                        result.monster = request.result.monster;
                        result.winCount = request.result.winCount;
                        result.loseCount = request.result.loseCount;
                        result.drawCount = request.result.drawCount;
                        resolve(result);
                    } else {
                        reject();
                    }
                };

            });
        })();
    }

    async win(id: string, monster: string): Promise<void> {
        const db = await this.#connectDB();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(id, monster)
                    .then(exist => {
                        const c = exist.winCount === undefined ? 0 : exist.winCount!
                        const data = {
                            id: exist.id,
                            winCount: (c + 1)
                        };
                        const request = db.transaction(["BattleResult"], "readwrite")
                            .objectStore("BattleResult")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    })
                    .catch(() => {
                        const data = {
                            id: id + "/" + monster,
                            roleId: id,
                            monster: monster,
                            winCount: 1
                        };
                        const request = db.transaction(["BattleResult"], "readwrite")
                            .objectStore("BattleResult")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    });


            });
        })();
    }

    async lose(id: string, monster: string): Promise<void> {
        const db = await this.#connectDB();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(id, monster)
                    .then(exist => {
                        const c = exist.loseCount === undefined ? 0 : exist.loseCount!
                        const data = {
                            id: exist.id,
                            loseCount: (c + 1)
                        };
                        const request = db.transaction(["BattleResult"], "readwrite")
                            .objectStore("BattleResult")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    })
                    .catch(() => {
                        const data = {
                            id: id + "/" + monster,
                            roleId: id,
                            monster: monster,
                            loseCount: 1
                        };
                        const request = db.transaction(["BattleResult"], "readwrite")
                            .objectStore("BattleResult")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    });


            });
        })();
    }

    async draw(id: string, monster: string): Promise<void> {
        const db = await this.#connectDB();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(id, monster)
                    .then(exist => {
                        const c = exist.drawCount === undefined ? 0 : exist.drawCount!
                        const data = {
                            id: exist.id,
                            drawCount: (c + 1)
                        };
                        const request = db.transaction(["BattleResult"], "readwrite")
                            .objectStore("BattleResult")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    })
                    .catch(() => {
                        const data = {
                            id: id + "/" + monster,
                            roleId: id,
                            monster: monster,
                            drawCount: 1
                        };
                        const request = db.transaction(["BattleResult"], "readwrite")
                            .objectStore("BattleResult")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    });


            });
        })();
    }

}

export = BattleResultStorage;