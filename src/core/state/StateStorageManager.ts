import RoleStateStorage from "./RoleStateStorage";

class StateStorageManager {

    static getRoleStateStorage() {
        return roleStateStorage;
    }

}

const roleStateStorage = new RoleStateStorage();

export = StateStorageManager;