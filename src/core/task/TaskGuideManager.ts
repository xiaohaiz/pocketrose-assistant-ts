import Credential from "../../util/Credential";
import TaskGuide from "./TaskGuide";
import TaskGuideStorage from "./TaskGuideStorage";

class TaskGuideManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async setTask(task: string) {
        const data = new TaskGuide();
        data.id = this.#credential.id;
        data.task = task;
        await TaskGuideStorage.getInstance().insert(data);
    }

    async finishTask() {
        await TaskGuideStorage.getInstance().delete(this.#credential.id);
    }

    async currentTask(): Promise<string | null> {
        let task: string | null = null;
        const data = await TaskGuideStorage.getInstance().load(this.#credential.id);
        (data && data.task) && (task = data.task);
        return task;
    }
}

export = TaskGuideManager;