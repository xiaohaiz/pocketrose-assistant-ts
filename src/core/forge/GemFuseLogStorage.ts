import ObjectID from "bson-objectid";
import {PocketDatabase} from "../../pocket/PocketDatabase";
import GemFuseLog from "./GemFuseLog";
import {DayRange, MonthRange} from "../../util/PocketDateUtils";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("STORAGE");

class GemFuseLogStorage {

    static async insert(data: GemFuseLog) {
        const document = data.asDocument();
        // @ts-ignore
        document.id = ObjectID().toHexString();
        // @ts-ignore
        document.createTime = Date.now();
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["GemFuseLog"], "readwrite")
                .objectStore("GemFuseLog")
                .add(document);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

    static async loads(): Promise<GemFuseLog[]> {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<GemFuseLog[]>((resolve, reject) => {
            const request = db
                .transaction(["GemFuseLog"], "readonly")
                .objectStore("GemFuseLog")
                .getAll();
            request.onerror = reject;
            request.onsuccess = () => {
                const dataList: GemFuseLog[] = [];
                if (request.result && request.result.length > 0) {
                    request.result.forEach(it => {
                        const data = new GemFuseLog();
                        data.id = it.id;
                        data.roleId = it.roleId;
                        data.createTime = it.createTime;
                        data.gem = it.gem;
                        data.effort = it.effort;
                        data.equipment = it.equipment;
                        data.success = it.success;
                        dataList.push(data);
                    });
                }
                resolve(dataList);
            };
        });
    }

    static async purgeExpired() {
        const month = MonthRange.current().previous().previous().previous()
            .previous().previous().previous();
        const day = new DayRange(month.start);
        logger.debug("Purge expired gem fusing log before: " + day.asText());

        const range = IDBKeyRange.upperBound(day.previous().end);
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["GemFuseLog"], "readwrite")
                .objectStore("GemFuseLog")
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
                    logger.debug("Total " + deletedCount + " gem fusing log(s) purged.");
                    resolve();
                }
            };
        });
    }
}

export = GemFuseLogStorage;