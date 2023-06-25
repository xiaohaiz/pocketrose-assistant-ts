import Constants from "./Constants";

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
                // BattleLog
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("BattleLog")) {
                    const store = db.createObjectStore("BattleLog", {
                        keyPath: "id", autoIncrement: false
                    });
                    store.createIndex("createTime", "createTime", {
                        unique: false
                    });
                    store.createIndex("roleId", "roleId", {
                        unique: false
                    });
                }

                // ------------------------------------------------------------
                // BattleScene
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("BattleScene")) {
                    db.createObjectStore("BattleScene", {
                        keyPath: "id", autoIncrement: false
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
                // CareerChangeLog
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("CareerChangeLog")) {
                    const store = db.createObjectStore("CareerChangeLog", {
                        keyPath: "id", autoIncrement: false
                    });
                    store.createIndex("roleId", "roleId", {
                        unique: false
                    });
                    store.createIndex("createTime", "createTime", {
                        unique: false
                    });
                    store.createIndex("career_1", "career_1", {
                        unique: false
                    });
                    store.createIndex("career_2", "career_2", {
                        unique: false
                    });
                }
                if (db.objectStoreNames.contains("RoleCareerTransfer")) {
                    db.deleteObjectStore("RoleCareerTransfer");
                }

                // ------------------------------------------------------------
                // PalaceTask
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("PalaceTask")) {
                    db.createObjectStore("PalaceTask", {
                        keyPath: "id", autoIncrement: false
                    });
                }

                // ------------------------------------------------------------
                // TaskGuide
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("TaskGuide")) {
                    db.createObjectStore("TaskGuide", {
                        keyPath: "id", autoIncrement: false
                    });
                }

                // ------------------------------------------------------------
                // LastLogin
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("LastLogin")) {
                    db.createObjectStore("LastLogin", {
                        keyPath: "id", autoIncrement: false
                    });
                }

                // ------------------------------------------------------------
                // BankRecord
                // ------------------------------------------------------------
                if (!db.objectStoreNames.contains("BankRecord")) {
                    const store = db.createObjectStore("BankRecord", {
                        keyPath: "id", autoIncrement: false
                    });
                    store.createIndex("recordDate", "recordDate", {
                        unique: false
                    });
                    store.createIndex("roleId", "roleId", {
                        unique: false
                    });
                }
            };
        });
    };

}


export = PocketDatabase;