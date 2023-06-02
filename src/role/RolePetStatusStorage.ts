import PocketDatabase from "../core/PocketDatabase";
import RolePetStatus from "./RolePetStatus";

class RolePetStatusStorage {

    async loads(idList: string[]): Promise<Map<string, RolePetStatus>> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<Map<string, RolePetStatus>>((resolve, reject) => {
                const request = db.transaction(["RolePetStatus"], "readonly")
                    .objectStore("RolePetStatus")
                    .getAll();  // Bad usage here

                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const dataMap = new Map<string, RolePetStatus>();
                        for (const it of request.result) {
                            const data = new RolePetStatus();
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

                const request = db.transaction(["RolePetStatus"], "readwrite")
                    .objectStore("RolePetStatus")
                    .put(document);

                request.onerror = reject;

                request.onsuccess = () => resolve();
            });
        })();
    }
}

export = RolePetStatusStorage;