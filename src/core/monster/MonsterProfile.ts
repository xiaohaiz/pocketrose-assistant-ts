import _ from "lodash";
import Constants from "../../util/Constants";
import StringUtils from "../../util/StringUtils";
import SetupLoader from "../../setup/SetupLoader";
import MonsterSpellLoader from "./MonsterSpellLoader";

class MonsterProfile {

    code?: string;
    name?: string;
    picture?: string;
    healthBaseStats?: number;           // 生命族值
    attackBaseStats?: number;           // 攻击族值
    defenseBaseStats?: number;          // 防御族值
    specialAttackBaseStats?: number;    // 特攻族值
    specialDefenseBaseStats?: number;   // 特防族值
    speedBaseStats?: number;            // 速度族值
    healthEffort?: number;
    attackEffort?: number;
    defenseEffort?: number;
    specialAttackEffort?: number;
    specialDefenseEffort?: number;
    speedEffort?: number;
    catchRatio?: number;
    growExperience?: number;
    location?: number;                  // 位置 1-初森 2-中塔 3-上洞
    pokemon?: string;                   // 对应的宝可梦的名字
    spellIds?: string;                  // 所有的技能id

    source?: MonsterProfile;
    targets?: MonsterProfile[];

    asText() {
        return StringUtils.substringBefore(this.name!, "(") +
            "/" +
            (_.endsWith(this.picture, ".gif") ? StringUtils.substringBefore(this.picture!, ".gif") : this.picture) +
            "/" +
            this.healthBaseStats +
            "/" +
            this.attackBaseStats +
            "/" +
            this.defenseBaseStats +
            "/" +
            this.specialAttackBaseStats +
            "/" +
            this.specialDefenseBaseStats +
            "/" +
            this.speedBaseStats +
            "/" +
            this.healthEffort +
            "/" +
            this.attackEffort +
            "/" +
            this.defenseEffort +
            "/" +
            this.specialAttackEffort +
            "/" +
            this.specialDefenseEffort +
            "/" +
            this.speedEffort +
            "/" +
            this.catchRatio +
            "/" +
            this.growExperience +
            "/" +
            this.location +
            "/" +
            this.pokemon +
            "/" +
            this.spellIds;
    }

    parseName(name: string) {
        this.name = name;
        if (name.includes("(") && name.includes(")")) {
            this.code = StringUtils.substringBetween(name, "(", ")");
        }
    }

    get nameHtml(): string | undefined {
        if (!this.name) return this.name;
        if (!this.pokemon) return this.name;
        if (!SetupLoader.isPokemonWikiEnabled()) return this.name;
        return "<a href='https://wiki.52poke.com/wiki/" + encodeURI(this.pokemon) + "' " +
            "target='_blank' rel='noopener noreferrer'>" +
            this.pokemon + "(" + this.code + ")" +
            "</a>";
    }

    get imageHtml() {
        const src = Constants.POCKET_DOMAIN + "/image/pet/" + this.picture;
        return "<img src='" + src + "' width='64' height='64' alt='" + this.code + "' style='border-width:0'>";
    }

    get locationText() {
        if (!this.location) {
            return null;
        }
        switch (this.location) {
            case 1:
                return "初森";
            case 2:
                return "中塔";
            case 3:
                return "上洞";
            default:
                return null;
        }
    }

    get spellText(): string {
        if (!this.spellIds || this.spellIds === "") return "";
        const names: string[] = [];
        _.split(this.spellIds, ",").forEach(it => {
            const id = _.parseInt(it);
            const name = MonsterSpellLoader.getSpellName(id);
            if (name) names.push(name);
        });
        return _.join(names, " ");
    }

    get totalBaseStats(): number {
        return this.healthBaseStats! +
            this.attackBaseStats! +
            this.defenseBaseStats! +
            this.specialAttackBaseStats! +
            this.specialDefenseBaseStats! +
            this.speedBaseStats!;
    }

    get totalEffort(): number {
        return this.healthEffort! +
            this.attackEffort! +
            this.defenseEffort! +
            this.specialAttackEffort! +
            this.specialDefenseEffort! +
            this.speedEffort!;
    }

    get perfectHealth(): number {
        const max = 20 + (this.healthEffort! * 10);
        const init = (this.healthBaseStats! * 20) + 40;
        const incr = (max / 2) * 99;
        return Math.ceil(init + incr);
    }

    get perfectAttack(): number {
        const max = this.attackEffort! + 1;
        const init = (this.attackBaseStats! * 2) + 40;
        const incr = (max / 2) * 99;
        return Math.ceil(init + incr);
    }

    get perfectDefense(): number {
        const max = this.defenseEffort! + 1;
        const init = (this.defenseBaseStats! * 2) + 40;
        const incr = (max / 2) * 99;
        return Math.ceil(init + incr);
    }

    get perfectSpecialAttack(): number {
        const max = this.specialAttackEffort! + 1;
        const init = (this.specialAttackBaseStats! * 2) + 40;
        const incr = (max / 2) * 99;
        return Math.ceil(init + incr);
    }

    get perfectSpecialDefense(): number {
        const max = this.specialDefenseEffort! + 1;
        const init = (this.specialDefenseBaseStats! * 2) + 40;
        const incr = (max / 2) * 99;
        return Math.ceil(init + incr);
    }

    get perfectSpeed(): number {
        const max = this.speedEffort! + 1;
        const init = (this.speedBaseStats! * 2) + 40;
        const incr = (max / 2) * 99;
        return Math.ceil(init + incr);
    }

    get perfectCapacity(): number {
        return Math.floor(this.perfectHealth / 3) +
            this.perfectAttack +
            this.perfectDefense +
            this.perfectSpecialAttack +
            this.perfectSpecialDefense +
            this.perfectSpeed;
    }


}

export = MonsterProfile;