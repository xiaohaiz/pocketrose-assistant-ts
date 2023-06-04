import PocketDatabase from "../PocketDatabase";
import PalaceTask from "../task/PalaceTask";
import RoleState from "./RoleState";

class RoleStateStorage {

    async load(id: string): Promise<RoleState | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<RoleState | null>((resolve, reject) => {
                const request = db
                    .transaction(["RoleState"], "readonly")
                    .objectStore("RoleState")
                    .get(id);

                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const data = new PalaceTask();
                        data.id = request.result.id;
                        data.updateTime = request.result.updateTime;
                        data.location = request.result.location;
                        data.townId = request.result.townId;
                        data.battleCount = request.result.battleCount;
                        data.castleName = request.result.castleName;
                        data.coordinate = request.result.coordinate;
                        resolve(data);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }

    async write(document: RoleState): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const data = document.asObject();
                // @ts-ignore
                data.updateTime = new Date().getTime();

                const request = db
                    .transaction(["RoleState"], "readwrite")
                    .objectStore("RoleState")
                    .put(data);
                request.onerror = reject;
                request.onsuccess = resolve;
            });
        })();
    }
}

export = RoleStateStorage;