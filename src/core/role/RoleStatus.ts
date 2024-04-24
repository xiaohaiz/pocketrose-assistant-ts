import {PocketDatabase} from "../../pocket/PocketDatabase";
import Credential from "../../util/Credential";
import Role from "./Role";
import Constants from "../../util/Constants";

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

    get mirrorCategory(): string | undefined {
        if (this.mirrorIndex === undefined) return undefined;
        if (this.mirrorIndex! === 0) {
            return "本体";
        } else {
            return "第" + this.mirrorIndex! + "分身";
        }
    }

    get imageHtml(): string {
        const src = Constants.POCKET_DOMAIN + "/image/head/" + this.image;
        return "<img src='" + src + "' alt='" + this.name + "' width='64' height='64'>";
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
        return await RoleStatusStorage.load(this.roleId);
    }

    async getCurrentLevel(): Promise<number | undefined> {
        const status = await this.load();
        if (status === null) return undefined;
        const level = status.level;
        if (level === undefined || level < 0) return undefined;
        return level;
    }

    async getCurrentMirrorIndex(): Promise<number | undefined> {
        const status = await this.load();
        if (status === null) return undefined;
        const mirrorIndex = status.mirrorIndex;
        if (mirrorIndex === undefined || mirrorIndex < 0) return undefined;
        return mirrorIndex;
    }

    async getCurrentCareer(): Promise<string | undefined> {
        const status = await this.load();
        if (status === null) return undefined;
        const career = status.career;
        if (career === undefined || career === "") return undefined;
        return career;
    }

    async getCurrentAdditionalRP(): Promise<number | undefined> {
        const status = await this.load();
        if (status === null) return undefined;
        const additionalRP = status.additionalRP;
        if (additionalRP === undefined || additionalRP < 0) return undefined;
        return additionalRP;
    }

    async getCurrentConsecrateRP(): Promise<number | undefined> {
        const status = await this.load();
        if (status === null) return undefined;
        const consecrateRP = status.consecrateRP;
        if (consecrateRP === undefined || consecrateRP < 0) return undefined;
        return consecrateRP;
    }

    async getCurrentTownId(): Promise<string | undefined> {
        const status = await this.load();
        if (status === null) return undefined;
        const townId = status.townId;
        if (townId === undefined || townId === "-1") return undefined;
        return townId;
    }

    async getCurrentPetLevel(): Promise<number | undefined> {
        const status = await this.load();
        if (status === null) return undefined;
        const petLevel = status.petLevel;
        if (petLevel === undefined || petLevel < 0) return undefined;
        return petLevel;
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

    async setLevel(level: number) {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.level = level;
        await RoleStatusStorage.upsert(status);
    }

    async setTownId(townId: string) {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.townId = townId;
        await RoleStatusStorage.upsert(status);
    }

    async unsetTownId() {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.townId = "-1";
        await RoleStatusStorage.upsert(status);
    }

    async setPetGender(petGender: string) {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.petGender = petGender;
        await RoleStatusStorage.upsert(status);
    }

    async unsetPetGender() {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.petGender = "";
        await RoleStatusStorage.upsert(status);
    }

    async setPetLevel(petLevel: number) {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.petLevel = petLevel;
        await RoleStatusStorage.upsert(status);
    }

    async unsetPetLevel() {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.petLevel = -1;
        await RoleStatusStorage.upsert(status);
    }

    async unsetMirrorIndex() {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.mirrorIndex = -1;
        await RoleStatusStorage.upsert(status);
    }

    async setCareer(career: string) {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.career = career;
        await RoleStatusStorage.upsert(status);
    }

    async unsetCareer() {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.career = "";
        await RoleStatusStorage.upsert(status);
    }

    async unsetConsecrateRP() {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.consecrateRP = -1;
        await RoleStatusStorage.upsert(status);
    }

    async updateBattleCount(battleCount: number, additionalRP?: number) {
        const status = new RoleStatus();
        status.id = this.roleId;
        status.battleCount = battleCount;
        if (additionalRP !== undefined) {
            status.additionalRP = additionalRP;
        }
        await RoleStatusStorage.upsert(status);
    }

    async increaseLevelIfNecessary() {
        const loaded = await this.load();
        if (loaded === null || loaded.level === undefined || loaded.level === 150) return;
        const status = new RoleStatus();
        status.id = this.roleId;
        status.level = loaded.level! + 1;
        await RoleStatusStorage.upsert(status);
    }
}

export {RoleStatus, RoleStatusStorage, RoleStatusManager};