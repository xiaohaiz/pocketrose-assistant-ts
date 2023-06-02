import PocketDatabase from "../core/PocketDatabase";
import BattleRecord from "./BattleRecord";

class BattleRecordStorage {

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

export = BattleRecordStorage;