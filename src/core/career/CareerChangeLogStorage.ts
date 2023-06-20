import ObjectID from "bson-objectid";
import PocketDatabase from "../../util/PocketDatabase";
import CareerChangeLog from "./CareerChangeLog";

class CareerChangeLogStorage {

    static getInstance() {
        return instance;
    }

    async insert(data: CareerChangeLog) {
        const db = await PocketDatabase.connectDatabase();
        const document = data.asDocument();
        // @ts-ignore
        document.id = ObjectID().toHexString();
        // @ts-ignore
        document.createTime = Date.now();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["CareerChangeLog"], "readwrite")
                .objectStore("CareerChangeLog")
                .add(document);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

}

const instance = new CareerChangeLogStorage();

export = CareerChangeLogStorage;