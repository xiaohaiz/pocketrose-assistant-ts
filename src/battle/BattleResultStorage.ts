import PocketDatabase from "../core/PocketDatabase";
import BattleResult from "./BattleResult";

class BattleResultStorage {

    async loads(): Promise<BattleResult[]> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<BattleResult[]>((resolve, reject) => {

                const request = db.transaction(["BattleResult"], "readonly")
                    .objectStore("BattleResult")
                    .getAll();

                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const resultList: BattleResult[] = [];
                        for (const it of request.result) {
                            const result = new BattleResult();
                            result.id = it.id;
                            result.roleId = it.roleId;
                            result.monster = it.monster;
                            result.winCount = it.winCount;
                            result.loseCount = it.loseCount;
                            result.drawCount = it.drawCount;
                            resultList.push(result);
                        }
                        resolve(resultList);
                    } else {
                        reject();
                    }
                };

            });
        })();
    }

    async load(id: string, monster: string): Promise<BattleResult> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<BattleResult>((resolve, reject) => {

                const request = db.transaction(["BattleResult"], "readonly")
                    .objectStore("BattleResult")
                    .get(id + "/" + monster);


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
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(id, monster)
                    .then(exist => {
                        let c = exist.winCount === undefined ? 0 : exist.winCount!
                        c++;
                        const data = exist.asObject();
                        // @ts-ignore
                        data.winCount = c;
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
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(id, monster)
                    .then(exist => {
                        let c = exist.loseCount === undefined ? 0 : exist.loseCount!
                        c++;
                        const data = exist.asObject();
                        // @ts-ignore
                        data.loseCount = c;
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
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(id, monster)
                    .then(exist => {
                        let c = exist.drawCount === undefined ? 0 : exist.drawCount!
                        c++;
                        const data = exist.asObject();
                        // @ts-ignore
                        data.drawCount = c;
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