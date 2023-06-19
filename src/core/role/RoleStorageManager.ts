import RoleCareerTransferStorage from "../career/RoleCareerTransferStorage";
import RoleEquipmentStatusStorage from "./RoleEquipmentStatusStorage";
import RolePetMapStorage from "./RolePetMapStorage";
import RolePetStatusStorage from "./RolePetStatusStorage";

class RoleStorageManager {

    /**
     * @deprecated
     */
    static getRoleCareerTransferStorage() {
        return roleCareerTransferStorage;
    }

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

const roleCareerTransferStorage = new RoleCareerTransferStorage();
const rolePetMapStorage = new RolePetMapStorage();
const rolePetStatusStorage = new RolePetStatusStorage();
const roleEquipmentStatusStorage = new RoleEquipmentStatusStorage();

export = RoleStorageManager;