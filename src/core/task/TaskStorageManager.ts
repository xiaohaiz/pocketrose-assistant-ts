import PalaceTaskStorage from "./PalaceTaskStorage";

class TaskStorageManager {

    static getPalaceTaskStorage() {
        return palaceTaskStorage;
    }

}

const palaceTaskStorage = new PalaceTaskStorage();

export = TaskStorageManager;