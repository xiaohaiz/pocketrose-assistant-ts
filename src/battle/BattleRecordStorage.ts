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