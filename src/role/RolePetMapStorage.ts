import PocketDatabase from "../core/PocketDatabase";
import RolePetMap from "./RolePetMap";

class RolePetMapStorage {

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

export = RolePetMapStorage;