import Constants from "../util/Constants";

class PocketDatabase {

    connectDB = () => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = window.indexedDB
                .open(Constants.DATABASE_NAME, Constants.DATABASE_VERSION);

            request.onerror = reject;

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onupgradeneeded = event => {
                // @ts-ignore
                const db: IDBDatabase = event.target.result;

                // ------------------------------------------------------------
                // BattleRecord
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("BattleRecord")) {
                    db.createObjectStore("BattleRecord", {
                        keyPath: "id", autoIncrement: false
                    });
                }

                // ------------------------------------------------------------
                // BattleResult
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("BattleResult")) {
                    const store = db.createObjectStore("BattleResult", {
                        keyPath: "id", autoIncrement: false
                    });
                    store.createIndex("roleId", "roleId", {
                        unique: false
                    });
                    store.createIndex("monster", "monster", {
                        unique: false
                    });
                }
            };
        });
    };

}


export = PocketDatabase;