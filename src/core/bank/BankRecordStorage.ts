import {PocketDatabase} from "../../pocket/PocketDatabase";
import StringUtils from "../../util/StringUtils";
import BankRecord from "./BankRecord";

class BankRecordStorage {

    static getInstance() {
        return instance;
    }

    async loads(): Promise<BankRecord[]> {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<BankRecord[]>((resolve, reject) => {
            const request = db
                .transaction(["BankRecord"], "readonly")
                .objectStore("BankRecord")
                .getAll();
            request.onerror = reject;
            request.onsuccess = () => {
                const dataList: BankRecord[] = [];
                if (request.result && request.result.length > 0) {
                    request.result.forEach(it => {
                        const data = new BankRecord();
                        data.id = it.id;
                        data.roleId = it.roleId;
                        data.createTime = it.createTime;
                        data.updateTime = it.updateTime;
                        data.recordDate = it.recordDate;
                        data.cash = it.cash;
                        data.saving = it.saving;
                        data.revision = it.revision;
                        dataList.push(data);
                    });
                }
                resolve(dataList);
            };
        });
    }

    async load(roleId: string): Promise<BankRecord | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<BankRecord | null>((resolve, reject) => {
                const store = db
                    .transaction(["BankRecord"], "readonly")
                    .objectStore("BankRecord");
                const indexRequest = store.index("roleId")
                    .getAllKeys(roleId);
                indexRequest.onerror = reject;
                indexRequest.onsuccess = () => {
                    if (!indexRequest.result || indexRequest.result.length === 0) {
                        resolve(null);
                    } else {
                        const recordDate = indexRequest.result
                            .map(it => it.toString())
                            .map(it => StringUtils.substringAfter(it, "/"))
                            .sort()
                            .reverse()[0];
                        const id = roleId + "/" + recordDate;
                        const dataRequest = store.get(id);
                        dataRequest.onerror = reject;
                        dataRequest.onsuccess = () => {
                            if (!dataRequest.result) {
                                resolve(null);
                            } else {
                                const data = new BankRecord();
                                data.id = dataRequest.result.id;
                                data.roleId = dataRequest.result.roleId;
                                data.createTime = dataRequest.result.createTime;
                                data.updateTime = dataRequest.result.updateTime;
                                data.recordDate = dataRequest.result.recordDate;
                                data.cash = dataRequest.result.cash;
                                data.saving = dataRequest.result.saving;
                                data.revision = dataRequest.result.revision;
                                resolve(data);
                            }
                        };
                    }
                };
            });
        })();
    }

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
                        document.id = id;
                        document.createTime = current;
                        document.updateTime = current;
                        document.revision = 1;
                        const writeRequest = store.add(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
                    }
                };
            });
        })();
    }

    async replay(data: BankRecord) {
        const db = await PocketDatabase.connectDatabase();
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
                    if (document.updateTime >= data.updateTime!) {
                        reject();
                    } else {
                        document.updateTime = data.updateTime;
                        // Increment revision
                        let revision = document.revision;
                        revision = revision === undefined ? 1 : revision;
                        revision++;
                        document.revision = revision;
                        document.cash = data.cash!;
                        document.saving = data.saving!;
                        const writeRequest = store.put(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
                    }
                } else {
                    const document = data.asDocument();
                    const writeRequest = store.add(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => resolve();
                }
            };
        });
    }

    async clear() {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["BankRecord"], "readwrite")
                .objectStore("BankRecord")
                .clear();
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

}

const instance = new BankRecordStorage();

export = BankRecordStorage;