import ObjectID from "bson-objectid";
import _ from "lodash";
import PocketDatabase from "../../util/PocketDatabase";
import CareerChangeLog from "./CareerChangeLog";
import RoleCareerTransfer from "./RoleCareerTransfer";

class CareerChangeLogStorage {

    static getInstance() {
        return instance;
    }

    async insert(data: CareerChangeLog) {
        const db = await PocketDatabase.connectDatabase();
        const document = data.asDocument();
        // @ts-ignore
        document.id = ObjectID().toHexString();
        // @ts-ignore
        document.createTime = Date.now();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["CareerChangeLog"], "readwrite")
                .objectStore("CareerChangeLog")
                .add(document);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

    async findByRoleId(roleId: string): Promise<CareerChangeLog[]> {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<CareerChangeLog[]>((resolve, reject) => {
            const request = db
                .transaction(["CareerChangeLog"], "readonly")
                .objectStore("CareerChangeLog")
                .index("roleId")
                .getAll(roleId);
            request.onerror = reject;
            request.onsuccess = () => {
                const dataList: CareerChangeLog[] = [];
                if (request.result) {
                    for (const it of request.result) {
                        const data = new CareerChangeLog();
                        data.id = it.id;
                        data.roleId = it.roleId;
                        data.createTime = it.createTime;
                        data.career_1 = it.career_1;
                        data.level_1 = it.level_1;
                        data.health_1 = it.health_1;
                        data.mana_1 = it.mana_1;
                        data.attack_1 = it.attack_1;
                        data.defense_1 = it.defense_1;
                        data.specialAttack_1 = it.specialAttack_1;
                        data.specialDefense_1 = it.specialDefense_1;
                        data.speed_1 = it.speed_1;
                        data.career_2 = it.career_2;
                        data.level_2 = it.level_2;
                        data.health_2 = it.health_2;
                        data.mana_2 = it.mana_2;
                        data.attack_2 = it.attack_2;
                        data.defense_2 = it.defense_2;
                        data.specialAttack_2 = it.specialAttack_2;
                        data.specialDefense_2 = it.specialDefense_2;
                        data.speed_2 = it.speed_2;
                        dataList.push(data);
                    }
                }
                resolve(dataList);
            };
        });
    }

    async loads(): Promise<CareerChangeLog[]> {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<CareerChangeLog[]>((resolve, reject) => {
            const request = db
                .transaction(["CareerChangeLog"], "readonly")
                .objectStore("CareerChangeLog")
                .getAll();
            request.onerror = reject;
            request.onsuccess = () => {
                const dataList: CareerChangeLog[] = [];
                if (request.result) {
                    for (const it of request.result) {
                        const data = new CareerChangeLog();
                        data.id = it.id;
                        data.roleId = it.roleId;
                        data.createTime = it.createTime;
                        data.career_1 = it.career_1;
                        data.level_1 = it.level_1;
                        data.health_1 = it.health_1;
                        data.mana_1 = it.mana_1;
                        data.attack_1 = it.attack_1;
                        data.defense_1 = it.defense_1;
                        data.specialAttack_1 = it.specialAttack_1;
                        data.specialDefense_1 = it.specialDefense_1;
                        data.speed_1 = it.speed_1;
                        data.career_2 = it.career_2;
                        data.level_2 = it.level_2;
                        data.health_2 = it.health_2;
                        data.mana_2 = it.mana_2;
                        data.attack_2 = it.attack_2;
                        data.defense_2 = it.defense_2;
                        data.specialAttack_2 = it.specialAttack_2;
                        data.specialDefense_2 = it.specialDefense_2;
                        data.speed_2 = it.speed_2;
                        dataList.push(data);
                    }
                }
                resolve(dataList);
            };
        });
    }

    // 迁移数据的临时方法
    async hasCreateTime(createTime: number): Promise<boolean> {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<boolean>((resolve, reject) => {
            const request = db
                .transaction(["CareerChangeLog"], "readonly")
                .objectStore("CareerChangeLog")
                .index("createTime")
                .getAllKeys(createTime);
            request.onerror = reject;
            request.onsuccess = () => resolve(request.result && request.result.length > 0);
        });
    }

    async migrate(data: RoleCareerTransfer) {
        if (data.createTime === undefined) return;
        if (await this.hasCreateTime(data.createTime)) return;
        const db = await PocketDatabase.connectDatabase();
        const document = data.asDocument();
        // @ts-ignore
        document.id = ObjectID().toHexString();
        return new Promise<void>((resolve, reject) => {
            const request = db
                .transaction(["CareerChangeLog"], "readwrite")
                .objectStore("CareerChangeLog")
                .add(document);
            request.onerror = reject;
            request.onsuccess = () => resolve();
        });
    }

    async importFromJson(json: string) {
        const documentList = JSON.parse(json);
        $("#careerChangeCount").html(documentList.length);
        if (documentList.length === 0) return;
        for (const document of documentList) {
            await this.importDocument(document);
        }
    }

    async importDocument(document: {}) {
        // @ts-ignore
        const id = document.id;
        const db = await PocketDatabase.connectDatabase();
        return new Promise<void>((resolve, reject) => {
            const readRequest = db
                .transaction(["CareerChangeLog"], "readwrite")
                .objectStore("CareerChangeLog")
                .get(id);
            readRequest.onerror = reject;
            readRequest.onsuccess = () => {
                if (readRequest.result) {
                    let c = _.parseInt($("#duplicatedCareerChangeCount").text());
                    c++;
                    $("#duplicatedCareerChangeCount").text(c);
                    resolve();
                } else {
                    const writeRequest = db
                        .transaction(["CareerChangeLog"], "readwrite")
                        .objectStore("CareerChangeLog")
                        .add(document);
                    writeRequest.onerror = reject;
                    writeRequest.onsuccess = () => {
                        let c = _.parseInt($("#importedCareerChangeCount").text());
                        c++;
                        $("#importedCareerChangeCount").text(c);
                        resolve();
                    };
                }
            };
        });
    }
}

const instance = new CareerChangeLogStorage();

export = CareerChangeLogStorage;