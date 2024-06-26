import ObjectID from "bson-objectid";
import _ from "lodash";
import {PocketDatabase} from "../../pocket/PocketDatabase";
import EquipmentConsecrateLog from "./EquipmentConsecrateLog";
import {PocketLogger} from "../../pocket/PocketLogger";
import {DayRange, MonthRange} from "../../util/PocketDateUtils";

const logger = PocketLogger.getLogger("STORAGE");

class EquipmentConsecrateLogStorage {

    static getInstance() {
        return instance;
    }

    async loads(): Promise<EquipmentConsecrateLog[]> {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<EquipmentConsecrateLog[]>((resolve, reject) => {
            const request = db
                .transaction(["EquipmentConsecrateLog"], "readonly")
                .objectStore("EquipmentConsecrateLog")
                .getAll();
            request.onerror = reject;
            request.onsuccess = () => {
                const dataList: EquipmentConsecrateLog[] = [];
                if (request.result && request.result.length > 0) {
                    request.result.forEach(it => {
                        const data = new EquipmentConsecrateLog();
                        data.id = it.id;
                        data.createTime = it.createTime;
                        data.roleId = it.roleId;
                        data.equipments = it.equipments;
                        dataList.push(data);
                    });
                }
                resolve(dataList);
            };
        });
    }

    async insert(data: EquipmentConsecrateLog) {
        const db = await PocketDatabase.connectDatabase();
        const document = data.asDocument();
        // @ts-ignore
        document.id = ObjectID().toHexString();
        // @ts-ignore
        document.createTime = Date.now();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["EquipmentConsecrateLog"], "readwrite")
                .objectStore("EquipmentConsecrateLog")
                .add(document);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

    async clear() {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["EquipmentConsecrateLog"], "readwrite")
                .objectStore("EquipmentConsecrateLog")
                .clear();
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

    async importFromJson(json: string) {
        const documentList = JSON.parse(json);
        $("#consecrateLogCount").html(documentList.length);
        if (documentList.length === 0) return;
        for (const document of documentList) {
            await this.importDocument(document);
        }
    }

    async importDocument(document: {}) {
        // @ts-ignore
        const id = document.id;
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const readRequest = db
                .transaction(["EquipmentConsecrateLog"], "readwrite")
                .objectStore("EquipmentConsecrateLog")
                .get(id);
            readRequest.onerror = reject;
            readRequest.onsuccess = () => {
                if (readRequest.result) {
                    let c = _.parseInt($("#duplicatedConsecrateLogCount").text());
                    c++;
                    $("#duplicatedConsecrateLogCount").text(c);
                    resolve();
                } else {
                    const writeRequest = db
                        .transaction(["EquipmentConsecrateLog"], "readwrite")
                        .objectStore("EquipmentConsecrateLog")
                        .add(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => {
                        let c = _.parseInt($("#importedConsecrateLogCount").text());
                        c++;
                        $("#importedConsecrateLogCount").text(c);
                        resolve();
                    };
                }
            };
        });
    }

    static async purgeExpired() {
        const month = MonthRange.current().previous().previous().previous()
            .previous().previous().previous();
        const day = new DayRange(month.start);
        logger.debug("Purge expired equipment consecrate log before: " + day.asText());

        const range = IDBKeyRange.upperBound(day.previous().end);
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["EquipmentConsecrateLog"], "readwrite")
                .objectStore("EquipmentConsecrateLog")
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
                    logger.debug("Total " + deletedCount + " equipment consecrate log(s) purged.");
                    resolve();
                }
            };
        });
    }
}

const instance = new EquipmentConsecrateLogStorage();

export = EquipmentConsecrateLogStorage;