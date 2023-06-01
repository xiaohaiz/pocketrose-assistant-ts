import Constants from "../util/Constants";
import BattleRecord from "./BattleRecord";

class BattleRecordStorage {

    readonly #connectDB = () => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = window.indexedDB.open(Constants.DATABASE_NAME);

            request.onerror = reject;

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onupgradeneeded = event => {
                // @ts-ignore
                const db: IDBDatabase = event.target.result;

                if (!db.objectStoreNames.contains("BattleRecord")) {
                    db.createObjectStore("BattleRecord", {
                        keyPath: "id", autoIncrement: false
                    });
                }
            };
        });
    };

    async load(id: string): Promise<BattleRecord> {
        const db = await this.#connectDB();
        return await (() => {
            return new Promise<BattleRecord>((resolve, reject) => {

                const request = db.transaction(["BattleRecord"], "readwrite")
                    .objectStore("BattleRecord")
                    .get(id);


                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const record = new BattleRecord();
                        record.id = request.result.id;
                        record.createTime = request.result.createTime;
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
        const db = await this.#connectDB();
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