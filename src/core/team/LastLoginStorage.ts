import {PocketDatabase} from "../../pocket/PocketDatabase";
import LastLogin from "./LastLogin";

class LastLoginStorage {

    static getInstance() {
        return instance;
    }

    async load(): Promise<LastLogin | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<LastLogin | null>((resolve, reject) => {
                const request = db
                    .transaction(["LastLogin"], "readonly")
                    .objectStore("LastLogin")
                    .get(1);

                request.onerror = reject;
                request.onsuccess = () => {
                    if (request.result) {
                        const data = new LastLogin();
                        data.id = request.result.id;
                        data.updateTime = request.result.updateTime;
                        data.roleId = request.result.roleId;
                        resolve(data);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }

    async write(roleId: string): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const data = {
                    id: 1,
                    updateTime: new Date().getTime(),
                    roleId: roleId
                }

                const request = db
                    .transaction(["LastLogin"], "readwrite")
                    .objectStore("LastLogin")
                    .put(data);

                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }

}

const instance = new LastLoginStorage();

export = LastLoginStorage;