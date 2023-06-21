import RoleEquipmentStatusStorage from "./RoleEquipmentStatusStorage";

class RoleStorageManager {


    static getRoleEquipmentStatusStorage() {
        return roleEquipmentStatusStorage;
    }
}

const roleEquipmentStatusStorage = new RoleEquipmentStatusStorage();

export = RoleStorageManager;