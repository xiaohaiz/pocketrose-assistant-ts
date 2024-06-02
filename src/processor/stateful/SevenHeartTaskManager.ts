import Credential from "../../util/Credential";
import {PocketCache} from "../../pocket/PocketCache";

class SevenHeartTaskManager {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async loadSevenHeartTask() {
        const task = new SevenHeartTask();
        const id = "SevenHeartTask_" + this.credential.id;
        const co = await PocketCache.loadCacheObject(id);
        if (co === null) {
            return task;
        }
        const json = co.json;
        if (json === undefined || json === "") {
            return task;
        }
        const document = JSON.parse(json);
        (document.task1) && (task.task1 = document.task1);
        (document.task2) && (task.task2 = document.task2);
        (document.task3) && (task.task3 = document.task3);
        (document.task4) && (task.task4 = document.task4);
        (document.task5) && (task.task5 = document.task5);
        (document.task6) && (task.task6 = document.task6);
        (document.task7) && (task.task7 = document.task7);
        (document.task8) && (task.task8 = document.task8);
        (document.task9) && (task.task9 = document.task9);
        return task;
    }

    async resetSevenHeartTask() {
        const id = "SevenHeartTask_" + this.credential.id;
        await PocketCache.deleteCacheObject(id);
    }

    async finishTask(taskId: number) {
        const task = await this.loadSevenHeartTask();
        const document = task.asDocument();
        document["task" + taskId] = true;
        const id = "SevenHeartTask_" + this.credential.id;
        await PocketCache.writeCacheObject(id, JSON.stringify(document), 0);
    }

    async taskProgress(): Promise<number> {
        const task = await this.loadSevenHeartTask();
        if (!task.task1) return 0;
        if (task.task1 && !task.task2) return 1;
        if (task.task2 && !task.task3) return 2;
        if (task.task3 && !task.task4) return 3;
        if (task.task4 && !task.task5) return 4;
        if (task.task5 && !task.task6) return 5;
        if (task.task6 && !task.task7) return 6;
        if (task.task7 && !task.task8) return 7;
        if (task.task8 && !task.task9) return 8;
        if (task.task9) return 9;
        return 0;
    }
}

class SevenHeartTask {

    task1?: boolean;
    task2?: boolean;
    task3?: boolean;
    task4?: boolean;
    task5?: boolean;
    task6?: boolean;
    task7?: boolean;
    task8?: boolean;
    task9?: boolean;

    asDocument() {
        const document: any = {};
        (this.task1 !== undefined) && (document.task1 = this.task1);
        (this.task2 !== undefined) && (document.task2 = this.task2);
        (this.task3 !== undefined) && (document.task3 = this.task3);
        (this.task4 !== undefined) && (document.task4 = this.task4);
        (this.task5 !== undefined) && (document.task5 = this.task5);
        (this.task6 !== undefined) && (document.task6 = this.task6);
        (this.task7 !== undefined) && (document.task7 = this.task7);
        (this.task8 !== undefined) && (document.task8 = this.task8);
        (this.task9 !== undefined) && (document.task9 = this.task9);
        return document;
    }

}

export {SevenHeartTaskManager, SevenHeartTask};