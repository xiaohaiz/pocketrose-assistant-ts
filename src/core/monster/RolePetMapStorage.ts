import {PocketDatabase} from "../../pocket/PocketDatabase";
import RolePetMap from "./RolePetMap";

class RolePetMapStorage {

    static getInstance() {
        return instance;
    }

    async loads(idList: string[]): Promise<Map<string, RolePetMap>> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<Map<string, RolePetMap>>((resolve, reject) => {
                const request = db.transaction(["RolePetMap"], "readonly")
                    .objectStore("RolePetMap")
                    .getAll();  // Bad usage here

                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const dataMap = new Map<string, RolePetMap>();
                        for (const it of request.result) {
                            const data = new RolePetMap();
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

    async load(id: string): Promise<RolePetMap> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<RolePetMap>((resolve, reject) => {
                const request = db.transaction(["RolePetMap"], "readonly")
                    .objectStore("RolePetMap")
                    .get(id);

                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const data = new RolePetMap();
                        data.id = request.result.id;
                        data.json = request.result.json;
                        data.updateTime = request.result.updateTime;
                        resolve(data);
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

                const request = db.transaction(["RolePetMap"], "readwrite")
                    .objectStore("RolePetMap")
                    .put(document);

                request.onerror = reject;

                request.onsuccess = () => resolve();
            });
        })();
    }

}

const instance = new RolePetMapStorage();

export = RolePetMapStorage;