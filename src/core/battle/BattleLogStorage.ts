import {PocketDatabase} from "../../pocket/PocketDatabase";
import BattleLog from "./BattleLog";
import {DayRange, MonthRange} from "../../util/PocketDateUtils";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("STORAGE");

class BattleLogStorage {

    static getInstance() {
        return instance;
    }

    static async purgeExpired() {
        const month = MonthRange.current().previous().previous().previous()
            .previous().previous().previous();
        const day = new DayRange(month.start);
        logger.debug("Purge expired battle log data before: " + day.asText());

        const range = IDBKeyRange.upperBound(day.previous().end);
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["BattleLog"], "readwrite")
                .objectStore("BattleLog")
                .index("createTime")
                .openCursor(range);
            request.onerror = reject;
            let deletedCount = 0;
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    cursor.delete();
                    deletedCount++;
                    cursor.continue();
                } else {
                    logger.debug("Total " + deletedCount + " battle log(s) purged.");
                    resolve();
                }
            };
        });
    }

    async importDocument(document: {}): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                // @ts-ignore
                const id = document.id;

                const store = db
                    .transaction(["BattleLog"], "readwrite")
                    .objectStore("BattleLog");
                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (readRequest.result) {
                        // Battle log already exists, ignore.
                        reject();
                    } else {
                        const writeRequest = store.add(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
                    }
                };

            });
        })();
    }

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
    async findByCreateTime(start: number, end?: number): Promise<BattleLog[]> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<BattleLog[]>((resolve, reject) => {
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

    async clear(): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const request = db
                    .transaction(["BattleLog"], "readwrite")
                    .objectStore("BattleLog")
                    .clear();
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }
}

const instance = new BattleLogStorage();

export = BattleLogStorage;