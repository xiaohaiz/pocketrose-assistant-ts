import {PocketDatabase} from "../../pocket/PocketDatabase";
import BattleRecord from "./BattleRecord";

class BattleRecordStorage {

    static async load(id: string): Promise<BattleRecord | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<BattleRecord | null>((resolve, reject) => {
                const request = db.transaction(["BattleRecord"], "readonly")
                    .objectStore("BattleRecord")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    if (request.result) {
                        const record = new BattleRecord();
                        record.id = request.result.id;
                        record.createTime = request.result.createTime;
                        record.html = request.result.html;
                        record.harvestList = request.result.harvestList;
                        record.petEggHatched = request.result.petEggHatched;
                        record.petSpellLearned = request.result.petSpellLearned;
                        record.petBeforeLevel = request.result.petBeforeLevel;
                        record.validationCodeFailed = request.result.validationCodeFailed;
                        resolve(record);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }

    static async write(record: BattleRecord): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = record.asDocument();
                document.createTime = Date.now();
                const request = db.transaction(["BattleRecord"], "readwrite")
                    .objectStore("BattleRecord")
                    .put(document);
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();

    }

}

export = BattleRecordStorage;