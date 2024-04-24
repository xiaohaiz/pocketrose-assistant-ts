import {PocketDatabase} from "../../pocket/PocketDatabase";
import {RolePetStatus} from "./RolePetStatus";

class RolePetStatusStorage {

    static async load(location: string, roleId: string): Promise<RolePetStatus | null> {
        const id = location + "/" + roleId;
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<RolePetStatus | null>((resolve, reject) => {
                const request = db.transaction(["RolePetStatus"], "readonly")
                    .objectStore("RolePetStatus")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    let record: RolePetStatus | null = null;
                    if (request.result) {
                        record = new RolePetStatus();
                        record.id = request.result.id;
                        record.json = request.result.json;
                        record.updateTime = request.result.updateTime;
                    }
                    resolve(record);
                };
            });
        })();
    }

    static async write(record: RolePetStatus): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const request = db.transaction(["RolePetStatus"], "readwrite")
                    .objectStore("RolePetStatus")
                    .put(record.asDocument());
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }
}

export {RolePetStatusStorage};