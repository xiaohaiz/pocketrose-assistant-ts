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

    async loads(): Promise<GemFuseLog[]> {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<GemFuseLog[]>((resolve, reject) => {
            const request = db
                .transaction(["GemFuseLog"], "readonly")
                .objectStore("GemFuseLog")
                .getAll();
            request.onerror = reject;
            request.onsuccess = () => {
                const dataList: GemFuseLog[] = [];
                if (request.result && request.result.length > 0) {
                    request.result.forEach(it => {
                        const data = new GemFuseLog();
                        data.id = it.id;
                        data.roleId = it.roleId;
                        data.createTime = it.createTime;
                        data.gem = it.gem;
                        data.effort = it.effort;
                        data.equipment = it.equipment;
                        dataList.push(data);
                    });
                }
                resolve(dataList);
            };
        });
    }
}

const instance = new GemFuseLogStorage();

export = GemFuseLogStorage;