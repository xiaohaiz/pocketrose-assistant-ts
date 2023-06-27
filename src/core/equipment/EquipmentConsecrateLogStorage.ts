import ObjectID from "bson-objectid";
import PocketDatabase from "../../util/PocketDatabase";
import EquipmentConsecrateLog from "./EquipmentConsecrateLog";

class EquipmentConsecrateLogStorage {

    static getInstance() {
        return instance;
    }

    async insert(data: EquipmentConsecrateLog) {
        const db = await PocketDatabase.connectDatabase();
        const document = data.asDocument();
        // @ts-ignore
        document.id = ObjectID().toHexString();
        // @ts-ignore
        document.createTime = Date.now();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["EquipmentConsecrateLog"], "readwrite")
                .objectStore("EquipmentConsecrateLog")
                .add(document);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

    async clear() {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["EquipmentConsecrateLog"], "readwrite")
                .objectStore("EquipmentConsecrateLog")
                .clear();
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }
}

const instance = new EquipmentConsecrateLogStorage();

export = EquipmentConsecrateLogStorage;