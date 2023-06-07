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
                        document.updateTime = log.createTime;
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
                        if (log.photo) {
                            let photoCount = document.photoCount;
                            photoCount = photoCount === undefined ? 0 : photoCount;
                            photoCount += log.photo;
                            document.photoCount = photoCount;
                        }
                        if (log.treasures) {
                            if (!document.treasures) {
                                document.treasures = {};
                            }
                            log.treasures.forEach((count, code) => {
                                let tc = document.treasures[code];
                                tc = tc === undefined ? 0 : tc;
                                tc += count;
                                document.treasures[code] = tc;
                            });
                        }
                        const writeRequest = store.put(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
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