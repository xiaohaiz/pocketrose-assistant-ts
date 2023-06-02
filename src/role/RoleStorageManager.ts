import RolePetMapStorage from "./RolePetMapStorage";

class RoleStorageManager {

    static getRolePetMapStorage() {
        return rolePetMapStorage;
    }

}

const rolePetMapStorage = new RolePetMapStorage();

export = RoleStorageManager;