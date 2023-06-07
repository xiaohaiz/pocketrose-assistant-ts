import PocketDatabase from "../PocketDatabase";
import BattleLog from "./BattleLog";

class BattleLogStorage {

    async write(log: BattleLog): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = log.asObject();

                const request = db
                    .transaction(["BattleLog"], "readwrite")
                    .objectStore("BattleLog")
                    .add(document);

                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }

    /**
     * Find battle logs by createTime in specified time range.
     * @param start Start time.
     * @param end End time, use current if not specified.
     */
    async findByCreateTime(start: number, end?: number) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise((resolve, reject) => {
                let range: IDBKeyRange;
                if (end === undefined) {
                    range = IDBKeyRange.lowerBound(start);
                } else {
                    range = IDBKeyRange.bound(start, end);
                }

                const request = db
                    .transaction(["BattleLog"], "readonly")
                    .objectStore("BattleLog")
                    .index("createTime")
                    .getAll(range);

                request.onerror = reject;
                request.onsuccess = () => {
                    const logList: BattleLog[] = [];
                    if (request.result) {
                        request.result.forEach(it => {
                            const log = new BattleLog();
                            log.id = it.id;
                            log.createTime = it.createTime;
                            log.roleId = it.roleId;
                            log.monster = it.monster;
                            log.result = it.result;
                            log.catch = it.catch;
                            log.photo = it.photo;
                            if (it.treasures) {
                                log.treasures = new Map<string, number>();
                                Object.keys(it.treasures)
                                    .forEach(code => {
                                        const count = it.treasures[code];
                                        log.treasures!.set(code, count);
                                    });
                            }
                            logList.push(log);
                        });
                    }
                    resolve(logList);
                };
            });
        })();
    }
}

export = BattleLogStorage;