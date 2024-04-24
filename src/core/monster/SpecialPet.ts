import {PocketDatabase} from "../../pocket/PocketDatabase";
import _ from "lodash";
import MonsterProfile from "./MonsterProfile";
import MonsterProfileLoader from "./MonsterProfileLoader";

class SpecialPet {

    id?: string;
    createTime?: number;
    updateTime?: number;
    revision?: number;
    name?: string;
    gender?: string;
    level?: number;
    health?: number;
    attack?: number;
    defense?: number;
    specialAttack?: number;
    specialDefense?: number;
    speed?: number;
    code?: number;

    generateId() {
        const a: string[] = [];
        a.push(_.toString(this.gender));
        a.push(_.toString(this.level));
        a.push(_.toString(this.health));
        a.push(_.toString(this.attack));
        a.push(_.toString(this.defense));
        a.push(_.toString(this.specialAttack));
        a.push(_.toString(this.specialDefense));
        a.push(_.toString(this.speed));
        this.id = _.join(a, ".");
    }

    get lookupProfile(): MonsterProfile | null {
        return MonsterProfileLoader.load(this.code);
    }

    get score(): number {
        return _.floor(this.health! / 3) + this.attack! +
            this.defense! + this.specialAttack! +
            this.specialDefense! + this.speed!;
    }

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.revision !== undefined) && (document.revision = this.revision);
        (this.name) && (document.name = this.name);
        (this.gender) && (document.gender = this.gender);
        (this.level !== undefined) && (document.level = this.level);
        (this.health !== undefined) && (document.health = this.health);
        (this.attack !== undefined) && (document.attack = this.attack);
        (this.defense !== undefined) && (document.defense = this.defense);
        (this.specialAttack !== undefined) && (document.specialAttack = this.specialAttack);
        (this.specialDefense !== undefined) && (document.specialDefense = this.specialDefense);
        (this.speed !== undefined) && (document.speed = this.speed);
        (this.code !== undefined) && (document.code = this.code);
        return document;
    }
}

class SpecialPetStorage {

    static async loadAll(): Promise<SpecialPet[]> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<SpecialPet[]>((resolve, reject) => {
                const request = db
                    .transaction(["SpecialPet"], "readonly")
                    .objectStore("SpecialPet")
                    .getAll();
                request.onerror = reject;
                request.onsuccess = () => {
                    const recordList: SpecialPet[] = [];
                    if (request.result && request.result.length > 0) {
                        request.result.forEach(it => {
                            const record = new SpecialPet();
                            record.id = it.id;
                            record.createTime = it.createTime;
                            record.updateTime = it.updateTime;
                            record.revision = it.revision;
                            record.name = it.name;
                            record.gender = it.gender;
                            record.level = it.level;
                            record.health = it.health;
                            record.attack = it.attack;
                            record.defense = it.defense;
                            record.specialAttack = it.specialAttack;
                            record.specialDefense = it.specialDefense;
                            record.speed = it.speed;
                            record.code = it.code;
                            recordList.push(record);
                        });
                    }
                    resolve(recordList);
                };
            });
        })();
    }

    static async load(id: string): Promise<SpecialPet | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<SpecialPet | null>((resolve, reject) => {
                const request = db
                    .transaction(["SpecialPet"], "readonly")
                    .objectStore("SpecialPet")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    if (request.result) {
                        const record = new SpecialPet();
                        record.id = request.result.id;
                        record.createTime = request.result.createTime;
                        record.updateTime = request.result.updateTime;
                        record.revision = request.result.revision;
                        record.name = request.result.name;
                        record.gender = request.result.gender;
                        record.level = request.result.level;
                        record.health = request.result.health;
                        record.attack = request.result.attack;
                        record.defense = request.result.defense;
                        record.specialAttack = request.result.specialAttack;
                        record.specialDefense = request.result.specialDefense;
                        record.speed = request.result.speed;
                        record.code = request.result.code;
                        resolve(record);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }

    static async upsert(record: SpecialPet) {
        record.generateId();
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const store = db
                    .transaction(["SpecialPet"], "readwrite")
                    .objectStore("SpecialPet");
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
                        (record.code !== undefined) && (document.code = record.code);
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

    static async remove(id: string) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const request = db
                    .transaction(["SpecialPet"], "readwrite")
                    .objectStore("SpecialPet")
                    .delete(id);
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }
}

export {SpecialPet, SpecialPetStorage};