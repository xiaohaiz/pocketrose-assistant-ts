import RoleUsingEquipment from "./RoleUsingEquipment";
import PocketDatabase from "../../util/PocketDatabase";

class RoleUsingEquipmentStorage {

    static async write(data: RoleUsingEquipment) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const request = db.transaction(["RoleUsingEquipment"], "readwrite")
                    .objectStore("RoleUsingEquipment")
                    .put(data.asDocument());
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }

    static async load(id: string): Promise<RoleUsingEquipment | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<RoleUsingEquipment | null>((resolve, reject) => {
                const request = db.transaction(["RoleUsingEquipment"], "readonly")
                    .objectStore("RoleUsingEquipment")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    if (request.result) {
                        const data = new RoleUsingEquipment();
                        data.id = request.result.id;
                        data.updateTime = request.result.updateTime;
                        data.usingWeapon = request.result.usingWeapon;
                        data.usingArmor = request.result.usingArmor;
                        data.usingAccessory = request.result.usingAccessory;
                        resolve(data);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }

}

export = RoleUsingEquipmentStorage;