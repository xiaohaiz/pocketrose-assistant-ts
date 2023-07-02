import ObjectID from "bson-objectid";
import PocketDatabase from "../../util/PocketDatabase";
import GemFuseLog from "./GemFuseLog";

class GemFuseLogStorage {

    static getInstance() {
        return instance;
    }

    async insert(data: GemFuseLog) {
        const document = data.asDocument();
        // @ts-ignore
        document.id = ObjectID().toHexString();
        // @ts-ignore
        document.createTime = Date.now();
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["GemFuseLog"], "readwrite")
                .objectStore("GemFuseLog")
                .add(document);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }
}

const instance = new GemFuseLogStorage();

export = GemFuseLogStorage;