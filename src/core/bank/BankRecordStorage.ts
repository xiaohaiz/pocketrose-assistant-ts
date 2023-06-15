import PocketDatabase from "../../util/PocketDatabase";
import BankRecord from "./BankRecord";

class BankRecordStorage {

    async write(data: BankRecord): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const request = db
                    .transaction(["BankRecord"], "readwrite")
                    .objectStore("BankRecord")
                    .put(data.asDocument());
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }

}

export = BankRecordStorage;