import PocketDatabase from "../../util/PocketDatabase";
import BattleScene from "./BattleScene";

class BattleSceneStorage {

    async loadLast(): Promise<BattleScene | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<BattleScene | null>((resolve, reject) => {
                const request = db
                    .transaction(["BattleScene"], "readonly")
                    .objectStore("BattleScene")
                    .get("LAST");
                request.onerror = reject;
                request.onsuccess = () => {
                    let data: BattleScene | null = null;
                    if (request.result) {
                        data = new BattleScene();
                        data.id = request.result.id;
                        data.updateTime = request.result.updateTime;
                        data.roleId = request.result.roleId;
                        data.request = request.result.request;
                        data.beforePage = request.result.beforePage;
                        data.afterPage = request.result.afterPage;
                    }
                    resolve(data);
                };
            });
        })();
    }

    async writeLast(data: BattleScene) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = data.asDocument();
                // @ts-ignore
                document.id = "LAST";
                // @ts-ignore
                document.updateTime = Date.now();
                const request = db
                    .transaction(["BattleScene"], "readwrite")
                    .objectStore("BattleScene")
                    .put(document);
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }

}

export = BattleSceneStorage;