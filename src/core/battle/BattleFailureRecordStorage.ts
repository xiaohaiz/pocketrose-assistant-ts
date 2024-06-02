import {PocketDatabase} from "../../pocket/PocketDatabase";
import RandomUtils from "../../util/RandomUtils";
import {BattleFailureRecord} from "./BattleFailureRecord";
import {DayRange} from "../../util/PocketDateUtils";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("STORAGE");

class BattleFailureRecordStorage {

    static async write(record: BattleFailureRecord) {
        if (record.id === undefined) record.id = RandomUtils.nextObjectID();
        if (record.createTime === undefined) record.createTime = new Date().getTime();

        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = record.asDocument();
                const request = db
                    .transaction(["BattleFailureRecord"], "readwrite")
                    .objectStore("BattleFailureRecord")
                    .add(document);
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }

    static async findRecords(startTime: number): Promise<BattleFailureRecord[]> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<BattleFailureRecord[]>((resolve, reject) => {
                const range = IDBKeyRange.lowerBound(startTime);

                const request = db
                    .transaction(["BattleFailureRecord"], "readonly")
                    .objectStore("BattleFailureRecord")
                    .index("createTime")
                    .getAll(range);

                request.onerror = reject;
                request.onsuccess = () => {
                    const records: BattleFailureRecord[] = [];
                    if (request.result) {
                        request.result.forEach(it => {
                            const record = new BattleFailureRecord();
                            record.id = it.id;
                            record.createTime = it.createTime;
                            record.roleId = it.roleId;
                            record.validationCodeFailure = it.validationCodeFailure;
                            records.push(record);
                        });
                    }
                    resolve(records);
                };
            });
        })();
    }

    static async purgeExpired() {
        const day = DayRange.current().previous();
        logger.debug("Purge expired battle failure record data before: " + day.asText());
        const range = IDBKeyRange.upperBound(day.start - 1);
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["BattleFailureRecord"], "readwrite")
                .objectStore("BattleFailureRecord")
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
                    logger.debug("Total " + deletedCount + " battle failure record(s) purged.");
                    resolve();
                }
            };
        });
    }

}

export {BattleFailureRecordStorage};