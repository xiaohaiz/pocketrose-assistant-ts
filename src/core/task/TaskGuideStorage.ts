import {PocketDatabase} from "../../pocket/PocketDatabase";
import TaskGuide from "./TaskGuide";

class TaskGuideStorage {

    static getInstance() {
        return instance;
    }

    async load(id: string): Promise<TaskGuide | null> {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<TaskGuide | null>((resolve, reject) => {
            const request = db
                .transaction(["TaskGuide"], "readonly")
                .objectStore("TaskGuide")
                .get(id);
            request.onerror = reject;
            request.onsuccess = () => {
                let data: TaskGuide | null = null;
                if (request.result) {
                    data = new TaskGuide();
                    data.id = request.result.id;
                    data.task = request.result.task;
                    data.createTime = request.result.createTime;
                }
                resolve(data);
            };
        });
    }

    async insert(data: TaskGuide) {
        const db = await PocketDatabase.connectDatabase();
        const document = data.asDocument();
        // @ts-ignore
        document.createTime = Date.now();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["TaskGuide"], "readwrite")
                .objectStore("TaskGuide")
                .add(document);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

    async delete(id: string) {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["TaskGuide"], "readwrite")
                .objectStore("TaskGuide")
                .delete(id);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }
}

const instance = new TaskGuideStorage();

export = TaskGuideStorage;