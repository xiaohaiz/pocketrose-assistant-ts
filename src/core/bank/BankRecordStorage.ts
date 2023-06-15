import PocketDatabase from "../../util/PocketDatabase";
import BankRecord from "./BankRecord";

class BankRecordStorage {

    async upsert(data: BankRecord): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const id = data.roleId + "/" + data.recordDate;
                const store = db
                    .transaction(["BankRecord"], "readwrite")
                    .objectStore("BankRecord");

                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (readRequest.result) {
                        const document = readRequest.result;
                        document.updateTime = Date.now();
                        // Increment revision
                        let revision = document.revision;
                        revision = revision === undefined ? 1 : revision;
                        revision++;
                        document.revision = revision;
                        if (data.cash !== undefined) {
                            document.cash = data.cash;
                        }
                        if (data.saving !== undefined) {
                            document.saving = data.saving;
                        }
                        const writeRequest = store.put(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
                    } else {
                        const current = Date.now();
                        const document = data.asDocument();
                        // @ts-ignore
                        document.id = id;
                        // @ts-ignore
                        document.createTime = current;
                        // @ts-ignore
                        document.updateTime = current;
                        // @ts-ignore
                        document.revision = 1;
                        const writeRequest = store.add(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
                    }
                };
            });
        })();
    }

}

export = BankRecordStorage;