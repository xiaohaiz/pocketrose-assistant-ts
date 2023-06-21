import RoleEquipmentStatusStorage from "./RoleEquipmentStatusStorage";
import RolePetStatusStorage from "./RolePetStatusStorage";

class RoleStorageManager {


    static getRolePetStatusStorage() {
        return rolePetStatusStorage;
    }

    static getRoleEquipmentStatusStorage() {
        return roleEquipmentStatusStorage;
    }
}

const rolePetStatusStorage = new RolePetStatusStorage();
const roleEquipmentStatusStorage = new RoleEquipmentStatusStorage();

export = RoleStorageManager;