import PocketDatabase from "../../util/PocketDatabase";
import BattleScene from "./BattleScene";

class BattleSceneStorage {


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