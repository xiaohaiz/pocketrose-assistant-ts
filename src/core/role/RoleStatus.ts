import {PocketDatabase} from "../../pocket/PocketDatabase";
import Credential from "../../util/Credential";
import Role from "./Role";
import Constants from "../../util/Constants";
import Town from "../town/Town";
import TownLoader from "../town/TownLoader";

class RoleStatus {

    id?: string;
    createTime?: number;
    updateTime?: number;
    revision?: number;
    name?: string;
    image?: string;
    level?: number;
    mirrorIndex?: number;
    career?: string;
    additionalRP?: number;
    consecrateRP?: number;
    battleCount?: number;
    townId?: string;
    petGender?: string;
    petLevel?: number;

    get readLevel(): number | undefined {
        return (this.level === undefined || this.level < 0) ? undefined : this.level;
    }

    get readMirrorIndex(): number | undefined {
        return (this.mirrorIndex === undefined || this.mirrorIndex < 0) ? undefined : this.mirrorIndex;
    }

    get readAdditionalRP(): number | undefined {
        return (this.additionalRP === undefined || this.additionalRP < 0) ? undefined : this.additionalRP;
    }

    get readConsecrateRP(): number | undefined {
        return (this.consecrateRP === undefined || this.consecrateRP < 0) ? undefined : this.consecrateRP;
    }

    get readTownId(): string | undefined {
        return (this.townId === undefined || this.townId === "-1") ? undefined : this.townId;
    }

    get readPetLevel(): number | undefined {
        return (this.petLevel === undefined || this.petLevel < 0) ? undefined : this.petLevel;
    }

    get readImageHtml(): string | undefined {
        if (this.image === undefined) return undefined;
        const src = Constants.POCKET_DOMAIN + "/image/head/" + this.image;
        return "<img src='" + src + "' alt='" + this.name + "' width='64' height='64'>";
    }

    get expired(): boolean {
        if (this.updateTime === undefined) return true;
        return (Date.now() - this.updateTime!) >= 1800000;
    }

    get mirrorCategory(): string | undefined {
        const mirrorIndex = this.readMirrorIndex;
        if (mirrorIndex === undefined) return undefined;
        if (mirrorIndex === 0) {
            return "本体";
        } else {
            return "第" + mirrorIndex + "分身";
        }
    }

    get town(): Town | null {
        return TownLoader.load(this.readTownId);
    }

    get updateTimeLocalString(): string | undefined {
        if (this.updateTime === undefined) return undefined;
        return new Date(this.updateTime).toLocaleString();
    }

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.revision !== undefined) && (document.revision = this.revision);
        (this.name) && (document.name = this.name);
        (this.level !== undefined) && (document.level = this.level);
        (this.mirrorIndex !== undefined) && (document.mirrorIndex = this.mirrorIndex);
        (this.career) && (document.career = this.career);
        (this.image) && (document.image = this.image);
        (this.mirrorIndex !== undefined) && (document.mirrorIndex = this.mirrorIndex);
        (this.additionalRP !== undefined) && (document.additionalRP = this.additionalRP);
        (this.consecrateRP !== undefined) && (document.consecrateRP = this.consecrateRP);
        (this.battleCount !== undefined) && (document.battleCount = this.battleCount);
        (this.townId) && (document.townId = this.townId);
        (this.petGender) && (document.petGender = this.petGender);
        (this.petLevel !== undefined) && (document.petLevel = this.petLevel);
        return document;
    }
}

class RoleStatusStorage {

    static async load(id: string): Promise<RoleStatus | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<RoleStatus | null>((resolve, reject) => {
                const request = db
                    .transaction(["RoleStatus"], "readonly")
                    .objectStore("RoleStatus")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    let record: RoleStatus | null = null;
                    if (request.result) {
                        record = new RoleStatus();
                        record.id = request.result.id;
                        record.createTime = request.result.createTime;
                        record.updateTime = request.result.updateTime;
                        record.revision = request.result.revision;
                        record.name = request.result.name;
                        record.image = request.result.image;
                        record.level = request.result.level;
                        record.mirrorIndex = request.result.mirrorIndex;
                        record.career = request.result.career;
                        record.additionalRP = request.result.additionalRP;
                        record.consecrateRP = request.result.consecrateRP;
                        record.battleCount = request.result.battleCount;
                        record.townId = request.result.townId;
                        record.petGender = request.result.petGender;
                        record.petLevel = request.result.petLevel;
                    }
                    resolve(record);
                };
            });
        })();
    }

    static async upsert(record: RoleStatus) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const store = db
                    .transaction(["RoleStatus"], "readwrite")
                    .objectStore("RoleStatus");
                const readRequest = store.get(record.id!);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (readRequest.result) {
                        const document = readRequest.result;
                        document.updateTime = Date.now();
                        // Increment revision
                        let revision = document.revision;
                        revision = revision === undefined ? 1 : revision;
                        revision++;
                        document.revision = revision;
                        (record.name) && (document.name = record.name);
                        (record.image) && (document.image = record.image);
                        (record.level !== undefined) && (document.level = record.level);
                        (record.mirrorIndex !== undefined) && (document.mirrorIndex = record.mirrorIndex);
                        (record.career) && (document.career = record.career);
                        (record.additionalRP !== undefined) && (document.additionalRP = record.additionalRP);
                        (record.consecrateRP !== undefined) && (document.consecrateRP = record.consecrateRP);
                        (record.battleCount !== undefined) && (document.battleCount = record.battleCount);
                        (record.townId) && (document.townId = record.townId);
                        (record.petGender) && (document.petGender = record.petGender);
                        (record.petLevel !== undefined) && (document.petLevel = record.petLevel);
                        const writeRequest = store.put(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
                    } else {
                        const current = Date.now();
                        const document = record.asDocument();
                        document.createTime = current;
                        document.updateTime = current;
                        document.revision = 1;
                        const writeRequest = store.add(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
                    }
                };
            });
        })();
    }

    static async update(record: RoleStatus) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const store = db
                    .transaction(["RoleStatus"], "readwrite")
                    .objectStore("RoleStatus");
                const readRequest = store.get(record.id!);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (!readRequest.result) {
                        // Cache missed, do nothing.
                        resolve();
                        return;
                    }
                    const document = readRequest.result;
                    document.updateTime = Date.now();
                    document.revision = (document.revision ?? 1) + 1;
                    (record.name) && (document.name = record.name);
                    (record.image) && (document.image = record.image);
                    (record.level !== undefined) && (document.level = record.level);
                    (record.mirrorIndex !== undefined) && (document.mirrorIndex = record.mirrorIndex);
                    (record.career) && (document.career = record.career);
                    (record.additionalRP !== undefined) && (document.additionalRP = record.additionalRP);
                    (record.consecrateRP !== undefined) && (document.consecrateRP = record.consecrateRP);
                    (record.battleCount !== undefined) && (document.battleCount = record.battleCount);
                    (record.townId) && (document.townId = record.townId);
                    (record.petGender) && (document.petGender = record.petGender);
                    (record.petLevel !== undefined) && (document.petLevel = record.petLevel);
                    const writeRequest = store.put(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => resolve();
                };
            });
        })();
    }

    static async evict(id: string) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const store = db
                    .transaction(["RoleStatus"], "readwrite")
                    .objectStore("RoleStatus");
                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (!readRequest.result) {
                        // Cache missed, do nothing.
                        resolve();
                        return;
                    }
                    const document = readRequest.result;
                    let changeCount = 0;
                    if (delete document.name) changeCount++;
                    if (delete document.image) changeCount++;
                    if (delete document.level) changeCount++;
                    if (delete document.mirrorIndex) changeCount++;
                    if (delete document.career) changeCount++;
                    if (delete document.additionalRP) changeCount++;
                    if (delete document.consecrateRP) changeCount++;
                    if (delete document.battleCount) changeCount++;
                    if (delete document.townId) changeCount++;
                    if (delete document.petGender) changeCount++;
                    if (delete document.petLevel) changeCount++;
                    if (changeCount === 0) {
                        // Nothing changed, ignore
                        resolve();
                        return;
                    }
                    document.updateTime = Date.now();
                    document.revision = (document.revision ?? 1) + 1;
                    const writeRequest = store.put(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => resolve();
                };
            });
        })();
    }

    static async unsetTown(id: string) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const store = db
                    .transaction(["RoleStatus"], "readwrite")
                    .objectStore("RoleStatus");
                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (!readRequest.result) {
                        // Cache missed, do nothing.
                        resolve();
                        return;
                    }
                    const document = readRequest.result;
                    let changeCount = 0;
                    if (delete document.townId) changeCount++;
                    if (changeCount === 0) {
                        // Nothing changed, ignore
                        resolve();
                        return;
                    }
                    document.updateTime = Date.now();
                    document.revision = (document.revision ?? 1) + 1;
                    const writeRequest = store.put(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => resolve();
                };
            });
        })();
    }

    static async unsetMirror(id: string) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const store = db
                    .transaction(["RoleStatus"], "readwrite")
                    .objectStore("RoleStatus");
                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (!readRequest.result) {
                        // Cache missed, do nothing.
                        resolve();
                        return;
                    }
                    const document = readRequest.result;
                    let changeCount = 0;
                    if (delete document.mirrorIndex) changeCount++;
                    if (delete document.career) changeCount++;
                    if (changeCount === 0) {
                        // Nothing changed, ignore
                        resolve();
                        return;
                    }
                    document.updateTime = Date.now();
                    document.revision = (document.revision ?? 1) + 1;
                    const writeRequest = store.put(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => resolve();
                };
            });
        })();
    }

    static async unsetConsecrateRP(id: string) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const store = db
                    .transaction(["RoleStatus"], "readwrite")
                    .objectStore("RoleStatus");
                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (!readRequest.result) {
                        // Cache missed, do nothing.
                        resolve();
                        return;
                    }
                    const document = readRequest.result;
                    let changeCount = 0;
                    if (delete document.consecrateRP) changeCount++;
                    if (changeCount === 0) {
                        // Nothing changed, ignore
                        resolve();
                        return;
                    }
                    document.updateTime = Date.now();
                    document.revision = (document.revision ?? 1) + 1;
                    const writeRequest = store.put(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => resolve();
                };
            });
        })();
    }

    static async unsetPet(id: string) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const store = db
                    .transaction(["RoleStatus"], "readwrite")
                    .objectStore("RoleStatus");
                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (!readRequest.result) {
                        // Cache missed, do nothing.
                        resolve();
                        return;
                    }
                    const document = readRequest.result;
                    let changeCount = 0;
                    if (delete document.petLevel) changeCount++;
                    if (delete document.petGender) changeCount++;
                    if (changeCount === 0) {
                        // Nothing changed, ignore
                        resolve();
                        return;
                    }
                    document.updateTime = Date.now();
                    document.revision = (document.revision ?? 1) + 1;
                    const writeRequest = store.put(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => resolve();
                };
            });
        })();
    }

    static async increaseLevel(id: string) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const store = db
                    .transaction(["RoleStatus"], "readwrite")
                    .objectStore("RoleStatus");
                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (!readRequest.result) {
                        // Cache missed, do nothing.
                        resolve();
                        return;
                    }
                    const document = readRequest.result;
                    const level = document.level;
                    if (level === undefined || level === 150) {
                        // No level field or max level reached, do nothing.
                        resolve();
                        return;
                    }
                    document.level = level + 1;
                    document.updateTime = Date.now();
                    document.revision = (document.revision ?? 1) + 1;
                    const writeRequest = store.put(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => resolve();
                };
            });
        })();
    }

    static async increasePetLevel(id: string) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const store = db
                    .transaction(["RoleStatus"], "readwrite")
                    .objectStore("RoleStatus");
                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (!readRequest.result) {
                        // Cache missed, do nothing.
                        resolve();
                        return;
                    }
                    const document = readRequest.result;
                    const petLevel = document.petLevel;
                    if (petLevel === undefined || petLevel === 100) {
                        // No petLevel field or max petLevel reached, do nothing.
                        resolve();
                        return;
                    }
                    document.petLevel = petLevel + 1;
                    document.updateTime = Date.now();
                    document.revision = (document.revision ?? 1) + 1;
                    const writeRequest = store.put(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => resolve();
                };
            });
        })();
    }

}

class RoleStatusManager {

    private readonly roleId: string;

    constructor(value: Credential | string) {
        if (value instanceof Credential) {
            this.roleId = value.id;
        } else {
            this.roleId = value as string;
        }
    }

    async load(): Promise<RoleStatus | null> {
        const status = await RoleStatusStorage.load(this.roleId);
        if (status !== null && status.expired) {
            await RoleStatusStorage.evict(this.roleId);
            return null;
        }
        return status;
    }

    async writeRoleStatus(role?: Role) {
        if (!role) return;
        const status = new RoleStatus();
        status.id = this.roleId;
        status.name = role.name;
        status.image = role.image;
        status.level = role.level;
        status.mirrorIndex = role.mirrorIndex;
        status.career = role.career;
        status.additionalRP = role.additionalRP;
        status.consecrateRP = role.consecrateRP;
        status.battleCount = role.battleCount;
        if (role.town !== undefined) {
            status.townId = role.town.id;
        } else {
            status.townId = "-1";
        }
        if (role.petGender !== undefined) {
            status.petGender = role.petGender;
        } else {
            status.petGender = "";
        }
        if (role.petLevel !== undefined) {
            status.petLevel = role.petLevel;
        } else {
            status.petLevel = -1;
        }
        await RoleStatusStorage.upsert(status);
    }

    async increaseLevel() {
        await RoleStatusStorage.increaseLevel(this.roleId);
    }

    async increasePetLevel() {
        await RoleStatusStorage.increasePetLevel(this.roleId);
    }

    async update(record: RoleStatus) {
        record.id = this.roleId;
        await RoleStatusStorage.update(record);
    }

    async unsetTown() {
        await RoleStatusStorage.unsetTown(this.roleId);
    }

    async unsetMirror() {
        await RoleStatusStorage.unsetMirror(this.roleId);
    }

    async unsetConsecrateRP() {
        await RoleStatusStorage.unsetConsecrateRP(this.roleId);
    }

    async unsetPet() {
        await RoleStatusStorage.unsetPet(this.roleId);
    }
}

export {RoleStatus, RoleStatusStorage, RoleStatusManager};