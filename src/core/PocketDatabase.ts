import Constants from "../util/Constants";

class PocketDatabase {

    static connectDatabase = () => {
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
                // RoleState
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("RoleState")) {
                    db.createObjectStore("RoleState", {
                        keyPath: "id", autoIncrement: false
                    });
                }

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

                // ------------------------------------------------------------
                // RolePetMap
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("RolePetMap")) {
                    db.createObjectStore("RolePetMap", {
                        keyPath: "id", autoIncrement: false
                    });
                }

                // ------------------------------------------------------------
                // RolePetStatus
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("RolePetStatus")) {
                    db.createObjectStore("RolePetStatus", {
                        keyPath: "id", autoIncrement: false
                    });
                }

                // ------------------------------------------------------------
                // RoleEquipmentStatus
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("RoleEquipmentStatus")) {
                    db.createObjectStore("RoleEquipmentStatus", {
                        keyPath: "id", autoIncrement: false
                    });
                }

                // ------------------------------------------------------------
                // RoleCareerTransfer
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("RoleCareerTransfer")) {
                    const store = db.createObjectStore("RoleCareerTransfer", {
                        keyPath: "id", autoIncrement: true
                    });
                    store.createIndex("roleId", "roleId", {
                        unique: false
                    });
                    store.createIndex("createTime", "createTime", {
                        unique: false
                    });
                }

                // ------------------------------------------------------------
                // PalaceTask
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("PalaceTask")) {
                    db.createObjectStore("PalaceTask", {
                        keyPath: "id", autoIncrement: false
                    });
                }
            };
        });
    };

}


export = PocketDatabase;