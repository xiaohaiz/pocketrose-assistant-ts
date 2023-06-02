import RolePetMapStorage from "./RolePetMapStorage";
import RolePetStatusStorage from "./RolePetStatusStorage";

class RoleStorageManager {

    static getRolePetMapStorage() {
        return rolePetMapStorage;
    }

    static getRolePetStatusStorage() {
        return rolePetStatusStorage;
    }
}

const rolePetMapStorage = new RolePetMapStorage();
const rolePetStatusStorage = new RolePetStatusStorage();

export = RoleStorageManager;