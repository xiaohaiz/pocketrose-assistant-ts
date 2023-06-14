import PocketDatabase from "../../util/PocketDatabase";
import RoleEquipmentStatus from "./RoleEquipmentStatus";

class RoleEquipmentStatusStorage {

    async loads(idList: string[]): Promise<Map<string, RoleEquipmentStatus>> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<Map<string, RoleEquipmentStatus>>((resolve, reject) => {
                const request = db.transaction(["RoleEquipmentStatus"], "readonly")
                    .objectStore("RoleEquipmentStatus")
                    .getAll();  // Bad usage here

                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const dataMap = new Map<string, RoleEquipmentStatus>();
                        for (const it of request.result) {
                            const data = new RoleEquipmentStatus();
                            data.id = it.id;
                            data.json = it.json;
                            data.updateTime = it.updateTime;
                            if (idList.includes(data.id!)) {
                                dataMap.set(data.id!, data);
                            }
                        }
                        resolve(dataMap);
                    } else {
                        reject();
                    }
                };
            });
        })();
    }

    async write(id: string, json: string): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = {};
                // @ts-ignore
                document.id = id;
                // @ts-ignore
                document.json = json;
                // @ts-ignore
                document.updateTime = new Date().getTime();

                const request = db.transaction(["RoleEquipmentStatus"], "readwrite")
                    .objectStore("RoleEquipmentStatus")
                    .put(document);

                request.onerror = reject;

                request.onsuccess = () => resolve();
            });
        })();
    }
}

export = RoleEquipmentStatusStorage;