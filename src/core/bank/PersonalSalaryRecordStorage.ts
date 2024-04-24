import {PocketDatabase} from "../../pocket/PocketDatabase";
import {PersonalSalaryRecord} from "./PersonalSalaryRecord";

class PersonalSalaryRecordStorage {

    static async write(record: PersonalSalaryRecord): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const request = db.transaction(["PersonalSalaryRecord"], "readwrite")
                    .objectStore("PersonalSalaryRecord")
                    .put(record.asDocument());
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }

    static async load(id: string): Promise<PersonalSalaryRecord | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<PersonalSalaryRecord | null>((resolve, reject) => {
                const request = db.transaction(["PersonalSalaryRecord"], "readonly")
                    .objectStore("PersonalSalaryRecord")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    if (request.result) {
                        const record = new PersonalSalaryRecord();
                        record.id = request.result.id;
                        record.createTime = request.result.createTime;
                        record.battleCount = request.result.battleCount;
                        record.code = request.result.code;
                        record.requiredTime = request.result.requiredTime;
                        record.requiredBattleCount = request.result.requiredBattleCount;
                        record.estimatedTime = request.result.estimatedTime;
                        record.estimatedBattleCount = request.result.estimatedBattleCount;
                        resolve(record);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }


}

export {PersonalSalaryRecordStorage};