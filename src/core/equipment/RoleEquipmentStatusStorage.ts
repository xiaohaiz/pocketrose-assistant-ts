import PocketDatabase from "../../util/PocketDatabase";
import {RoleEquipmentStatus} from "./RoleEquipmentStatus";

class RoleEquipmentStatusStorage {

    static async load(location: string, roleId: string): Promise<RoleEquipmentStatus | null> {
        const id = location + "/" + roleId;
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<RoleEquipmentStatus | null>((resolve, reject) => {
                const request = db.transaction(["RoleEquipmentStatus"], "readonly")
                    .objectStore("RoleEquipmentStatus")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    if (request.result) {
                        const record = new RoleEquipmentStatus();
                        record.id = request.result.id;
                        record.updateTime = request.result.updateTime;
                        record.json = request.result.json;
                        record.powerGemCount = request.result.powerGemCount;
                        record.weightGemCount = request.result.weightGemCount;
                        record.luckGemCount = request.result.luckGemCount;
                        resolve(record);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }

    static async write(record: RoleEquipmentStatus): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = record.asDocument();
                const request = db.transaction(["RoleEquipmentStatus"], "readwrite")
                    .objectStore("RoleEquipmentStatus")
                    .put(document);
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }
}

export {RoleEquipmentStatusStorage};