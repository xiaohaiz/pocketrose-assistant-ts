import _ from "lodash";
import Constants from "../../util/Constants";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import SetupLoader from "../../setup/SetupLoader";
import MonsterProfileLoader from "./MonsterProfileLoader";
import MonsterProfile from "./MonsterProfile";
import {SpecialPet, SpecialPetStorage} from "./SpecialPet";

class Pet {

    index?: number;                  // 下标（唯一性）
    selectable?: boolean;
    name?: string;
    gender?: string;
    using?: boolean;
    level?: number;
    picture?: string;
    health?: number;
    maxHealth?: number;
    spell1?: string;                 // 技能1
    spell2?: string;                 // 技能2
    spell3?: string;                 // 技能3
    spell4?: string;                 // 技能4
    usingSpell1?: boolean;           // 是否使用技能1
    usingSpell2?: boolean;           // 是否使用技能2
    usingSpell3?: boolean;           // 是否使用技能3
    usingSpell4?: boolean;           // 是否使用技能4
    spell1Description?: string;      // 技能1描述
    spell2Description?: string;      // 技能2描述
    spell3Description?: string;      // 技能3描述
    spell4Description?: string;      // 技能4描述
    attack?: number;
    defense?: number;
    specialAttack?: number;
    specialDefense?: number;
    speed?: number;
    experience?: number;
    love?: number;
    attribute1?: string;
    attribute2?: string;
    race?: string;
    code?: string;

    before?: string;
    after?: string;
    mapCount?: number;
    evolution?: number;

    location?: string;  // P/C/R

    get isMaxLevel(): boolean {
        return this.level !== undefined && this.level === 100;
    }

    get attributeList(): string[] {
        const s: string[] = [];
        if (this.attribute1 !== undefined && this.attribute1 !== "无") s.push(this.attribute1);
        if (this.attribute2 !== undefined && this.attribute2 !== "无") s.push(this.attribute2);
        return s;
    }

    get growExperience() {
        const profile = MonsterProfileLoader.load(this.code);
        return profile?.growExperience;
    }

    get nameHtml() {
        const profile = MonsterProfileLoader.load(this.name);
        return profile ? profile.nameHtml : this.name;
    }

    get raceHtml() {
        const profile = MonsterProfileLoader.load(this.race);
        return profile ? profile.nameHtml : this.race;
    }

    get beforeHtml() {
        const profile = MonsterProfileLoader.load(this.before);
        return profile ? profile.nameHtml : this.before;
    }

    get afterHtml() {
        const profile = MonsterProfileLoader.load(this.after);
        return profile ? profile.nameHtml : this.after;
    }

    get imageHtml() {
        const src = Constants.POCKET_DOMAIN + "/image/pet/" + this.picture;
        return "<img src='" + src + "' width='64' height='64' alt='" + this.race + "' style='border-width:0'>";
    }

    createImageHtml(id: string, className: string) {
        const src = Constants.POCKET_DOMAIN + "/image/pet/" + this.picture;
        return "<img src='" + src + "' width='64' height='64' alt='" + this.race + "' " +
            "style='border-width:0' id='" + id + "' class='" + className + "'>";
    }

    get usingHtml() {
        return this.using ? "★" : "";
    }

    get levelHtml() {
        if (!SetupLoader.isExperienceProgressBarEnabled()) {
            return this.level!.toString();
        }
        if (this.level! === 100) {
            return "<span title='满级' style='color:red'>MAX</span>";
        }
        const ratio = this.level! / 100;
        const progressBar = PageUtils.generateProgressBarHTML(ratio);
        return "<span title='" + ("LV " + this.level) + "'>" + progressBar + "</span>&nbsp;<span>" + _.padStart(this.level!.toString(), 2, "0") + "</span>";
    }

    get healthHtml() {
        return this.health + "/" + this.maxHealth;
    }

    get attackHtml() {
        if (this.attack! >= 375) {
            return "<span title='倚天' style='color:red;font-weight:bold'>" + this.attack + "</span>"
        } else {
            return this.attack!.toString();
        }
    }

    get defenseHtml() {
        if (this.defense! >= 375) {
            return "<span title='磐石' style='color:red;font-weight:bold'>" + this.defense + "</span>"
        } else {
            return this.defense!.toString();
        }
    }

    get specialAttackHtml() {
        if (this.specialAttack! >= 375) {
            return "<span title='仙人' style='color:red;font-weight:bold'>" + this.specialAttack + "</span>"
        } else {
            return this.specialAttack!.toString();
        }
    }

    get specialDefenseHtml() {
        if (this.specialDefense! >= 375) {
            return "<span title='军神' style='color:red;font-weight:bold'>" + this.specialDefense + "</span>"
        } else {
            return this.specialDefense!.toString();
        }
    }

    get speedHtml() {
        if (this.speed! >= 375) {
            return "<span title='疾风' style='color:red;font-weight:bold'>" + this.speed + "</span>"
        } else {
            return this.speed!.toString();
        }
    }

    get experienceHtml() {
        if (!SetupLoader.isExperienceProgressBarEnabled()) {
            return this.experience!.toString();
        }
        if (this.level! === 100) {
            return "<span title='满级' style='color:red'>MAX</span>";
        }
        const nextLevel = this.level! + 1;
        const maxExperience = (Math.pow(nextLevel / 100, 2) * 1000000);
        const ratio = this.experience! / maxExperience;
        const progressBar = PageUtils.generateProgressBarHTML(ratio);
        return "<span title='" + this.experience + "'>" + progressBar + "</span>";
    }

    get beforeCode(): string {
        return StringUtils.substringBetween(this.before!, "(", ")");
    }

    get afterCode(): string {
        return StringUtils.substringBetween(this.after!, "(", ")");
    }

    get capacity(): number {
        return Math.floor(this.maxHealth! / 3) +
            this.attack! +
            this.defense! +
            this.specialAttack! +
            this.specialDefense! +
            this.speed!;
    }

    get locationOrder() {
        switch (this.location) {
            case "P":
                return 1;
            case "C":
                return 2;
            case "R":
                return 3;
            default:
                return 0;
        }
    }

    get canConsecrate(): boolean {
        if (this.using) return false;
        if (SetupLoader.isOnlyConsecrateInitialPetEnabled()) {
            return this.level === 1;
        }
        return true;
    }

    get lookupCode(): string | undefined {
        if (this.code !== undefined) return this.code;
        if (this.name === undefined) return undefined;
        if (!_.includes(this.name, "(")) return undefined;
        if (!_.endsWith(this.name, ")")) return undefined;
        let s = StringUtils.substringAfterLast(this.name, "(");
        return StringUtils.substringBefore(s, ")");
    }

    async lookupProfile(): Promise<MonsterProfile | null> {
        const profile = MonsterProfileLoader.load(this.lookupCode);
        if (profile !== null) return profile;
        if (!this.isMaxLevel) return null;
        const special = new SpecialPet();
        special.gender = this.gender;
        special.level = this.level;
        special.health = this.maxHealth;
        special.attack = this.attack;
        special.defense = this.defense;
        special.specialAttack = this.specialAttack;
        special.specialDefense = this.specialDefense;
        special.speed = this.speed;
        special.generateId();
        const sp = await SpecialPetStorage.load(special.id!);
        if (sp === null) return null;
        return MonsterProfileLoader.load(sp.code);
    }

    static parse(text: string): Pet {
        const ss = _.split(text, "/");
        const pet = new Pet();
        pet.name = _.unescape(ss[0]);
        pet.gender = ss[1];
        pet.level = _.parseInt(ss[2]);
        pet.maxHealth = _.parseInt(ss[3]);
        pet.attack = _.parseInt(ss[4]);
        pet.defense = _.parseInt(ss[5]);
        pet.specialAttack = _.parseInt(ss[6]);
        pet.specialDefense = _.parseInt(ss[7]);
        pet.speed = _.parseInt(ss[8]);
        pet.location = ss[9];
        return pet;
    }

    static sortPetList(source: Pet[]): Pet[] {
        const target = _.clone(source);
        target.sort(Pet.sorter);
        return target;
    }

    static sorter(a: Pet, b: Pet): number {
        if (!SetupLoader.isEquipmentPetSortEnabled()) {
            return 0;
        }
        let ret = a.locationOrder - b.locationOrder;
        if (ret !== 0) {
            return ret;
        }
        ret = b.level! - a.level!;
        if (ret !== 0) {
            return ret;
        }
        let a1 = (a.name!.includes("(") && a.name!.includes(")")) ? 0 : 1;
        let b1 = (b.name!.includes("(") && b.name!.includes(")")) ? 0 : 1;
        ret = a1 - b1;
        if (ret !== 0) {
            return ret;
        }

        let a2 = (a.name!.includes("(") && a.name!.includes(")")) ?
            StringUtils.substringBetween(a.name!, "(", ")") : a.name!;
        let b2 = (b.name!.includes("(") && b.name!.includes(")")) ?
            StringUtils.substringBetween(b.name!, "(", ")") : b.name!;
        return a2.localeCompare(b2);
    }

    static sortByCode(a: Pet, b: Pet): number {
        if (!SetupLoader.isEquipmentPetSortEnabled()) {
            return 0;
        }
        const c1 = _.parseInt(a.lookupCode ?? "999");
        const c2 = _.parseInt(b.lookupCode ?? "999");
        if (c1 === 999 && c2 === 999) {
            return a.name!.localeCompare(b.name!);
        }
        return c1 - c2;
    }
}

export = Pet;