import Constants from "../util/Constants";
import StringUtils from "../util/StringUtils";
import Castle from "./Castle";
import Town from "./Town";

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
    attribute?: string;             // 属性
    location?: string;              // 所在位置(TOWN|CASTLE|WILD|METRO)
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
}

export = Role;