import Credential from "../../util/Credential";
import {PocketDatabase} from "../../pocket/PocketDatabase";

class RoleUsingEquipment {

    id?: string;
    updateTime?: number;
    usingWeapon?: string;
    usingArmor?: string;
    usingAccessory?: string;

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.usingWeapon) && (document.usingWeapon = this.usingWeapon);
        (this.usingArmor) && (document.usingArmor = this.usingArmor);
        (this.usingAccessory) && (document.usingAccessory = this.usingAccessory);
        return document;
    }

    get available(): boolean {
        return this.usingWeapon !== undefined || this.usingArmor !== undefined || this.usingAccessory !== undefined;
    }
}

class RoleUsingEquipmentStorage {

    static async load(id: string): Promise<RoleUsingEquipment | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<RoleUsingEquipment | null>((resolve, reject) => {
                const request = db
                    .transaction(["RoleUsingEquipment"], "readonly")
                    .objectStore("RoleUsingEquipment")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    if (request.result) {
                        const record = new RoleUsingEquipment();
                        record.id = request.result.id;
                        record.updateTime = request.result.updateTime;
                        record.usingWeapon = request.result.usingWeapon;
                        record.usingArmor = request.result.usingArmor;
                        record.usingAccessory = request.result.usingAccessory;
                        resolve(record);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }

    static async write(record: RoleUsingEquipment) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = record.asDocument();
                document.updateTime = Date.now();
                const request = db
                    .transaction(["RoleUsingEquipment"], "readwrite")
                    .objectStore("RoleUsingEquipment")
                    .put(document);
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }
}

class RoleUsingEquipmentManager {

    private readonly roleId: string;

    constructor(value: Credential | string) {
        if (value instanceof Credential) {
            this.roleId = value.id;
        } else {
            this.roleId = value as string;
        }
    }

    async load(): Promise<RoleUsingEquipment | null> {
        return RoleUsingEquipmentStorage.load(this.roleId);
    }

    async write(record: RoleUsingEquipment) {
        record.id = this.roleId;
        await RoleUsingEquipmentStorage.write(record);
    }

}

export {RoleUsingEquipment, RoleUsingEquipmentStorage, RoleUsingEquipmentManager};