import PocketDatabase from "../PocketDatabase";
import BattleLog from "./BattleLog";
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
                        const dataList: BattleResult[] = [];
                        for (const it of request.result) {
                            const data = new BattleResult();
                            data.id = it.id;
                            data.roleId = it.roleId;
                            data.monster = it.monster;
                            data.winCount = it.winCount;
                            data.loseCount = it.loseCount;
                            data.drawCount = it.drawCount;
                            data.catchCount = it.catchCount;
                            data.photoCount = it.photoCount;

                            if (it.treasures) {
                                data.treasures = new Map<string, number>();
                                Object.keys(it.treasures)
                                    .forEach(code => {
                                        const count = it.treasures[code];
                                        data.treasures!.set(code, count);
                                    });
                            }

                            dataList.push(data);
                        }
                        resolve(dataList);
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
                        const data = new BattleResult();
                        data.id = request.result.id;
                        data.updateTime = request.result.updateTime;
                        data.roleId = request.result.roleId;
                        data.monster = request.result.monster;
                        data.winCount = request.result.winCount;
                        data.loseCount = request.result.loseCount;
                        data.drawCount = request.result.drawCount;
                        data.catchCount = request.result.catchCount;
                        data.photoCount = request.result.photoCount;

                        if (request.result.treasures) {
                            data.treasures = new Map<string, number>();
                            Object.keys(request.result.treasures)
                                .forEach(code => {
                                    const count = request.result.treasures[code];
                                    data.treasures!.set(code, count);
                                });
                        }

                        resolve(data);
                    } else {
                        reject();
                    }
                };

            });
        })();
    }


    async replay(log: BattleLog): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const id = log.roleId + "/" + log.monster;
                const store = db
                    .transaction(["BattleResult"], "readwrite")
                    .objectStore("BattleResult");

                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (readRequest.result) {
                        // Update exists battle result.
                        const document = readRequest.result;
                        document.updateTime = new Date().getTime();
                        switch (log.result) {
                            case "战胜":
                                let winCount = document.winCount;
                                winCount = winCount === undefined ? 0 : winCount;
                                winCount++;
                                document.winCount = winCount;
                                break;
                            case "战败":
                                let loseCount = document.loseCount;
                                loseCount = loseCount === undefined ? 0 : loseCount;
                                loseCount++;
                                document.loseCount = loseCount;
                                break;
                            case "平手":
                                let drawCount = document.drawCount;
                                drawCount = drawCount === undefined ? 0 : drawCount;
                                drawCount++;
                                document.drawCount = drawCount;
                                break;
                        }
                        if (log.catch) {
                            let catchCount = document.catchCount;
                            catchCount = catchCount === undefined ? 0 : catchCount;
                            catchCount += log.catch;
                            document.catchCount = catchCount;
                        }
                    } else {
                        // No battle result exists, create new one.
                        const document = BattleResult.newInstance(log).asObject();
                        const writeRequest = store.add(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
                    }
                };
            });
        })();
    }

    async win(id: string, monster: string,
              catchCount?: number,
              photoCount?: number,
              treasures?: Map<string, number>): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(id, monster)
                    .then(exist => {
                        const data = exist.asObject();

                        let c = exist.winCount === undefined ? 0 : exist.winCount!
                        c++;
                        // @ts-ignore
                        data.winCount = c;

                        if (catchCount !== undefined) {
                            c = exist.catchCount === undefined ? 0 : exist.catchCount!
                            c += catchCount;
                            // @ts-ignore
                            data.catchCount = c;
                        }
                        if (photoCount !== undefined) {
                            c = exist.photoCount === undefined ? 0 : exist.photoCount!
                            c += photoCount;
                            // @ts-ignore
                            data.photoCount = c;
                        }

                        if (treasures !== undefined) {
                            // @ts-ignore
                            if (data.treasures === undefined) {
                                // @ts-ignore
                                data.treasures = {};
                            }
                            treasures.forEach((v, k) => {
                                let tc = exist.treasures?.get(k);
                                // @ts-ignore
                                data.treasures[k] = (tc === undefined ? 0 : tc) + v;
                            });
                        }

                        // @ts-ignore
                        data.updateTime = new Date().getTime();
                        const request = db.transaction(["BattleResult"], "readwrite")
                            .objectStore("BattleResult")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    })
                    .catch(() => {
                        const data = {
                            id: id + "/" + monster,
                            updateTime: new Date().getTime(),
                            roleId: id,
                            monster: monster,
                            winCount: 1,
                            catchCount: (catchCount === undefined ? 0 : catchCount),
                            photoCount: (photoCount === undefined ? 0 : photoCount)
                        };
                        if (treasures !== undefined) {
                            // @ts-ignore
                            data.treasures = {};
                            treasures.forEach((v, k) => {
                                // @ts-ignore
                                data.treasures[k] = v;
                            });
                        }
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
                        // @ts-ignore
                        data.updateTime = new Date().getTime();
                        const request = db.transaction(["BattleResult"], "readwrite")
                            .objectStore("BattleResult")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    })
                    .catch(() => {
                        const data = {
                            id: id + "/" + monster,
                            updateTime: new Date().getTime(),
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

    async draw(id: string, monster: string,
               catchCount?: number,
               photoCount?: number,
               treasures?: Map<string, number>): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                this.load(id, monster)
                    .then(exist => {
                        const data = exist.asObject();

                        let c = exist.drawCount === undefined ? 0 : exist.drawCount!
                        c++;
                        // @ts-ignore
                        data.drawCount = c;

                        if (catchCount !== undefined) {
                            c = exist.catchCount === undefined ? 0 : exist.catchCount!
                            c += catchCount;
                            // @ts-ignore
                            data.catchCount = c;
                        }
                        if (photoCount !== undefined) {
                            c = exist.photoCount === undefined ? 0 : exist.photoCount!
                            c += photoCount;
                            // @ts-ignore
                            data.photoCount = c;
                        }

                        if (treasures !== undefined) {
                            // @ts-ignore
                            if (data.treasures === undefined) {
                                // @ts-ignore
                                data.treasures = {};
                            }
                            treasures.forEach((v, k) => {
                                let tc = exist.treasures?.get(k);
                                // @ts-ignore
                                data.treasures[k] = (tc === undefined ? 0 : tc) + v;
                            });
                        }

                        // @ts-ignore
                        data.updateTime = new Date().getTime();
                        const request = db.transaction(["BattleResult"], "readwrite")
                            .objectStore("BattleResult")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    })
                    .catch(() => {
                        const data = {
                            id: id + "/" + monster,
                            updateTime: new Date().getTime(),
                            roleId: id,
                            monster: monster,
                            drawCount: 1,
                            catchCount: (catchCount === undefined ? 0 : catchCount),
                            photoCount: (photoCount === undefined ? 0 : photoCount)
                        };
                        if (treasures !== undefined) {
                            // @ts-ignore
                            data.treasures = {};
                            treasures.forEach((v, k) => {
                                // @ts-ignore
                                data.treasures[k] = v;
                            });
                        }
                        const request = db.transaction(["BattleResult"], "readwrite")
                            .objectStore("BattleResult")
                            .put(data);
                        request.onerror = reject;
                        request.onsuccess = () => resolve();
                    });


            });
        })();
    }


    async clear(): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const request = db
                    .transaction(["BattleResult"], "readwrite")
                    .objectStore("BattleResult")
                    .clear();
                request.onerror = reject;
                request.onsuccess = () => {
                    resolve();
                };
            });
        })();
    }
}

export = BattleResultStorage;