import PocketDatabase from "../PocketDatabase";
import BattleLog from "./BattleLog";

class BattleLogStorage {

    async write(log: BattleLog): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = log.asObject();

                const request = db
                    .transaction(["BattleLog"], "readwrite")
                    .objectStore("BattleLog")
                    .add(document);

                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }
}

export = BattleLogStorage;