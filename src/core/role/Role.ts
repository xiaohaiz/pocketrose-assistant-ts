import Constants from "../../util/Constants";
import StringUtils from "../../util/StringUtils";
import Castle from "../castle/Castle";
import Town from "../town/Town";
import _ from "lodash";

class Role {
    name?: string;               // 姓名
    race?: string;
    gender?: string;
    level?: number;              // 等级
    country?: string;
    unit?: string;
    image?: string;
    health?: number;
    maxHealth?: number;
    mana?: number;
    maxMana?: number;
    spell?: string;
    attack?: number;
    defense?: number;
    specialAttack?: number;
    specialDefense?: number;
    speed?: number;                 // 速度
    pet?: string;                   // 当前宠物
    petGender?: string;             // 当前宠物性别
    petLevel?: number;              // 当前宠物的等级
    attribute?: string;             // 属性
    location?: string;              // 所在位置(TOWN|CASTLE|WILD|METRO|TANG)
    town?: Town;
    castle?: Castle;
    additionalLuck?: number;        // 装备附加幸运
    task?: string;                  // 当前任务
    lastBattleField?: string;       // 上次战斗场所
    consecrateRP?: number;          // 祭奠RP
    additionalRP?: number;          // 额外RP
    mirrorIndex?: number;           // 当前分身
    mirrorCount?: number;           // 分身数
    battleCount?: number;           // 战数
    battleWinCount?: number;        // 战胜数
    experience?: number;
    rank?: string;
    cash?: number;
    career?: string;                // 职业
    masterCareerList?: string[];    // 掌握职业
    treasureList?: string[];        // 仙人的宝物
    honorHtml?: string;             // 荣誉
    titleList?: string;             // 称号
    hasMirror?: boolean;

    canConsecrate?: boolean;        // 是否可祭奠，从主页解析

    get imageHtml(): string {
        const src = Constants.POCKET_DOMAIN + "/image/head/" + this.image;
        return "<img src='" + src + "' alt='" + this.name + "' width='64' height='64' id='roleImage'>";
    }

    get experienceHtml(): string {
        if (this.experience! >= 14900) {
            return "MAX";
        } else {
            return this.experience!.toString();
        }
    }

    parseHealth(s: string) {
        if (s.includes("/")) {
            this.health = parseInt(StringUtils.substringBeforeSlash(s));
            this.maxHealth = parseInt(StringUtils.substringAfterSlash(s));
        } else {
            this.health = parseInt(s);
        }
    }

    parseMana(s: string) {
        if (s.includes("/")) {
            this.mana = parseInt(StringUtils.substringBeforeSlash(s));
            this.maxMana = parseInt(StringUtils.substringAfterSlash(s));
        } else {
            this.mana = parseInt(s);
        }
    }

    asShortText(): string {
        return this.name + " " + this.level +
            " " + this.health + "/" + this.maxHealth +
            " " + this.mana + "/" + this.maxMana +
            " " + this.attack +
            " " + this.defense +
            " " + this.specialAttack +
            " " + this.specialDefense +
            " " + this.speed;
    }

    get healthHtml(): string {
        return this.health + "/" + this.maxHealth;
    }

    get manaHtml(): string {
        return this.mana + "/" + this.maxMana;
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

    get hasTreasureBag(): boolean | undefined {
        if (this.masterCareerList !== undefined) {
            return _.includes(this.masterCareerList, "剑圣");
        }
        if (this.mirrorCount !== undefined) {
            return this.mirrorCount > 0;
        }
        return undefined;
    }

    get hasGoldenCage(): boolean | undefined {
        if (this.masterCareerList !== undefined) {
            return _.includes(this.masterCareerList, "贤者");
        }
        if (this.mirrorCount !== undefined) {
            return this.mirrorCount > 0;
        }
        return undefined;
    }
}

export = Role;