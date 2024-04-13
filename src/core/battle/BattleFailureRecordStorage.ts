import PocketDatabase from "../../util/PocketDatabase";
import RandomUtils from "../../util/RandomUtils";
import {BattleFailureRecord} from "./BattleFailureRecord";

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

}

export {BattleFailureRecordStorage};