import Town from "../pocket/Town";
import Constants from "../util/Constants";
import StringUtils from "../util/StringUtils";
import Castle from "./Castle";

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
    speed?: number;
    pet?: string;
    attribute?: string;
    location?: string;           // 所在位置(TOWN|CASTLE|WILD)
    town?: Town;
    castle?: Castle;
    task?: string;
    battleCount?: number;
    experience?: number;
    cash?: number;
    career?: string;
    masterCareerList?: string[];
    treasureList?: string[];
    hasMirror?: boolean;

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