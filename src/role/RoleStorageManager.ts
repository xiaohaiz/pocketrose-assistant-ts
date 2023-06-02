import RoleEquipmentStatusStorage from "./RoleEquipmentStatusStorage";
import RolePetMapStorage from "./RolePetMapStorage";
import RolePetStatusStorage from "./RolePetStatusStorage";

class RoleStorageManager {

    static getRolePetMapStorage() {
        return rolePetMapStorage;
    }

    static getRolePetStatusStorage() {
        return rolePetStatusStorage;
    }

    static getRoleEquipmentStatusStorage() {
        return roleEquipmentStatusStorage;
    }
}

const rolePetMapStorage = new RolePetMapStorage();
const rolePetStatusStorage = new RolePetStatusStorage();
const roleEquipmentStatusStorage = new RoleEquipmentStatusStorage();

export = RoleStorageManager;