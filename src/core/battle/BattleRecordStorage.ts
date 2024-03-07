import PocketDatabase from "../../util/PocketDatabase";
import BattleRecord from "./BattleRecord";

class BattleRecordStorage {

    static getInstance() {
        return instance;
    }

    async load(id: string): Promise<BattleRecord> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<BattleRecord>((resolve, reject) => {

                const request = db.transaction(["BattleRecord"], "readonly")
                    .objectStore("BattleRecord")
                    .get(id);


                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const record = new BattleRecord();
                        record.id = request.result.id;
                        record.html = request.result.html;
                        record.harvestList = request.result.harvestList;
                        record.petEggHatched = request.result.petEggHatched;
                        record.petSpellLearned = request.result.petSpellLearned;
                        record.validationCodeFailed = request.result.validationCodeFailed;
                        resolve(record);
                    } else {
                        reject();
                    }
                };

            });
        })();
    }

    async write(record: BattleRecord): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const request = db.transaction(["BattleRecord"], "readwrite")
                    .objectStore("BattleRecord")
                    .put(record.asObject());

                request.onerror = reject;

                request.onsuccess = () => resolve();

            });
        })();

    }

}

const instance = new BattleRecordStorage();

export = BattleRecordStorage;