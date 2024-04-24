import Credential from "../../util/Credential";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";
import Pet from "../monster/Pet";
import Constants from "../../util/Constants";
import {PocketDatabase} from "../../pocket/PocketDatabase";

class RoleUsingPet {

    id?: string;
    updateTime?: number;
    name?: string;
    image?: string;
    gender?: string;
    level?: number;
    maxHealth?: number;
    attack?: number;
    defense?: number;
    specialAttack?: number;
    specialDefense?: number;
    speed?: number;
    spell1?: string;                 // 技能1
    spell2?: string;                 // 技能2
    spell3?: string;                 // 技能3
    spell4?: string;                 // 技能4
    usingSpell1?: boolean;           // 是否使用技能1
    usingSpell2?: boolean;           // 是否使用技能2
    usingSpell3?: boolean;           // 是否使用技能3
    usingSpell4?: boolean;           // 是否使用技能4

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.name) && (document.name = this.name);
        (this.image) && (document.image = this.image);
        (this.gender) && (document.gender = this.gender);
        (this.level !== undefined) && (document.level = this.level);
        (this.maxHealth !== undefined) && (document.maxHealth = this.maxHealth);
        (this.attack !== undefined) && (document.attack = this.attack);
        (this.defense !== undefined) && (document.defense = this.defense);
        (this.specialAttack !== undefined) && (document.specialAttack = this.specialAttack);
        (this.specialDefense !== undefined) && (document.specialDefense = this.specialDefense);
        (this.speed !== undefined) && (document.speed = this.speed);
        (this.spell1) && (document.spell1 = this.spell1);
        (this.spell2) && (document.spell2 = this.spell2);
        (this.spell3) && (document.spell3 = this.spell3);
        (this.spell4) && (document.spell4 = this.spell4);
        (this.usingSpell1 !== undefined) && (document.usingSpell1 = this.usingSpell1);
        (this.usingSpell2 !== undefined) && (document.usingSpell2 = this.usingSpell2);
        (this.usingSpell3 !== undefined) && (document.usingSpell3 = this.usingSpell3);
        (this.usingSpell4 !== undefined) && (document.usingSpell4 = this.usingSpell4);
        return document;
    }

    get imageHTML(): string | undefined {
        if (this.image === undefined) return undefined;
        const src = Constants.POCKET_DOMAIN + "/image/pet/" + this.image;
        return "<img src='" + src + "' width='64' height='64' alt='" + this.name + "' style='border-width:0'>";
    }

    get spellHTML(): string | undefined {
        if (this.spell1 === undefined) return undefined;
        if (this.spell2 === undefined) return undefined;
        if (this.spell3 === undefined) return undefined;
        if (this.spell4 === undefined) return undefined;
        if (this.usingSpell1 === undefined) return undefined;
        if (this.usingSpell2 === undefined) return undefined;
        if (this.usingSpell3 === undefined) return undefined;
        if (this.usingSpell4 === undefined) return undefined;
        const c1: string = this.usingSpell1 ? "darkblue" : "darkcyan";
        const c2: string = this.usingSpell2 ? "darkblue" : "darkcyan";
        const c3: string = this.usingSpell3 ? "darkblue" : "darkcyan";
        const c4: string = this.usingSpell4 ? "darkblue" : "darkcyan";
        return "" +
            "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0;border-width:0'>" +
            "<tbody style='text-align:left'>" +
            "<tr>" +
            "<td style='white-space:nowrap;color:" + c1 + "'>" + this.spell1 + "<span> </span></td>" +
            "<td style='white-space:nowrap;color:" + c2 + "'>" + this.spell2 + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='white-space:nowrap;color:" + c3 + "'>" + this.spell3 + "<span> </span></td>" +
            "<td style='white-space:nowrap;color:" + c4 + "'>" + this.spell4 + "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }

}

class RoleUsingPetStorage {

    static async load(id: string): Promise<RoleUsingPet | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<RoleUsingPet | null>((resolve, reject) => {
                const request = db
                    .transaction(["RoleUsingPet"], "readonly")
                    .objectStore("RoleUsingPet")
                    .get(id);
                request.onerror = reject;
                request.onsuccess = () => {
                    if (request.result) {
                        const record = new RoleUsingPet();
                        record.id = request.result.id;
                        record.updateTime = request.result.updateTime;
                        record.name = request.result.name;
                        record.image = request.result.image;
                        record.gender = request.result.gender;
                        record.level = request.result.level;
                        record.maxHealth = request.result.maxHealth;
                        record.attack = request.result.attack;
                        record.defense = request.result.defense;
                        record.specialAttack = request.result.specialAttack;
                        record.specialDefense = request.result.specialDefense;
                        record.speed = request.result.speed;
                        record.spell1 = request.result.spell1;
                        record.spell2 = request.result.spell2;
                        record.spell3 = request.result.spell3;
                        record.spell4 = request.result.spell4;
                        record.usingSpell1 = request.result.usingSpell1;
                        record.usingSpell2 = request.result.usingSpell2;
                        record.usingSpell3 = request.result.usingSpell3;
                        record.usingSpell4 = request.result.usingSpell4;
                        resolve(record);
                    } else {
                        resolve(null);
                    }
                };
            });
        })();
    }

    static async write(record: RoleUsingPet) {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const document = record.asDocument();
                document.updateTime = Date.now();
                const request = db
                    .transaction(["RoleUsingPet"], "readwrite")
                    .objectStore("RoleUsingPet")
                    .put(document);
                request.onerror = reject;
                request.onsuccess = () => resolve();
            });
        })();
    }

}

class RoleUsingPetManager {

    private readonly roleId: string;

    constructor(value: Credential | string) {
        if (value instanceof Credential) {
            this.roleId = value.id;
        } else {
            this.roleId = value as string;
        }
    }

    async load(): Promise<RoleUsingPet | null> {
        return RoleUsingPetStorage.load(this.roleId);
    }

    async writeFromPetPage(petPage: PersonalPetManagementPage) {
        if (petPage.petList) {
            let usingPet: Pet | null = null;
            for (const pet of petPage.petList) {
                if (pet.using!) {
                    usingPet = pet;
                    break;
                }
            }
            if (usingPet !== null) {
                const record = new RoleUsingPet();
                record.id = this.roleId;
                record.name = usingPet.name;
                record.image = usingPet.picture;
                record.gender = usingPet.gender;
                record.level = usingPet.level;
                record.maxHealth = usingPet.maxHealth;
                record.attack = usingPet.attack;
                record.defense = usingPet.defense;
                record.specialAttack = usingPet.specialAttack;
                record.specialDefense = usingPet.specialDefense;
                record.speed = usingPet.speed;
                record.spell1 = usingPet.spell1;
                record.spell2 = usingPet.spell2;
                record.spell3 = usingPet.spell3;
                record.spell4 = usingPet.spell4;
                record.usingSpell1 = usingPet.usingSpell1;
                record.usingSpell2 = usingPet.usingSpell2;
                record.usingSpell3 = usingPet.usingSpell3;
                record.usingSpell4 = usingPet.usingSpell4;
                await RoleUsingPetStorage.write(record);
            }
        }
    }
}

export {RoleUsingPet, RoleUsingPetStorage, RoleUsingPetManager};