import PocketDatabase from "../../util/PocketDatabase";
import TaskGuide from "./TaskGuide";

class TaskGuideStorage {

    static getInstance() {
        return instance;
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
                .add(data);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }
}

const instance = new TaskGuideStorage();

export = TaskGuideStorage;