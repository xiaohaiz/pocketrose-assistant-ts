import PocketDatabase from "../../core/PocketDatabase";
import PalaceTask from "./PalaceTask";

class PalaceTaskStorage {

    async load(id: string): Promise<PalaceTask> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<PalaceTask>((resolve, reject) => {
                const request = db
                    .transaction(["PalaceTask"], "readonly")
                    .objectStore("PalaceTask")
                    .get(id);


                request.onerror = reject;

                request.onsuccess = () => {
                    if (request.result) {
                        const data = new PalaceTask();
                        data.id = request.result.id;
                        data.updateTime = request.result.updateTime;
                        data.monster = request.result.monster;
                        resolve(data);
                    } else {
                        reject();
                    }
                };
            });
        })();
    }

}

export = PalaceTaskStorage;