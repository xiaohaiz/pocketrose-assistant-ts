import PocketDatabase from "../../util/PocketDatabase";
import BattleScene from "./BattleScene";

class BattleSceneStorage {

    static getInstance() {
        return instance;
    }

    async loads(): Promise<BattleScene[]> {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<BattleScene[]>((resolve, reject) => {
            const request = db
                .transaction(["BattleScene"], "readonly")
                .objectStore("BattleScene")
                .getAll();
            request.onerror = reject;
            request.onsuccess = () => {
                const dataList: BattleScene[] = [];
                if (request.result && request.result.length > 0) {
                    request.result.forEach(it => {
                        const data = new BattleScene();
                        data.id = it.id;
                        data.updateTime = it.updateTime;
                        data.roleId = it.roleId;
                        data.request = it.request;
                        data.beforePage = it.beforePage;
                        data.afterPage = it.afterPage;
                        dataList.push(data);
                    });
                }
                resolve(dataList);
            };
        });
    }

    async upsert(data: BattleScene) {
        const document = data.asDocument();
        document.updateTime = Date.now();
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["BattleScene"], "readwrite")
                .objectStore("BattleScene")
                .put(document);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

}

const instance = new BattleSceneStorage();

export = BattleSceneStorage;