class TaskGuideStorage {

    static getInstance() {
        return instance;
    }

}

const instance = new TaskGuideStorage();

export = TaskGuideStorage;