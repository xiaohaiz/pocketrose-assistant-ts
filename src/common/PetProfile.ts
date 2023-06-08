import _ from "lodash";
import MonsterSpellDict from "../core/monster/MonsterSpellDict";
import Pokemon from "../core/Pokemon";
import Constants from "../util/Constants";
import StringUtils from "../util/StringUtils";

class PetProfile {

    code?: string;
    name?: string;
    picture?: string;
    healthBaseStats?: number;
    attackBaseStats?: number;
    defenseBaseStats?: number;
    specialAttackBaseStats?: number;
    specialDefenseBaseStats?: number;
    speedBaseStats?: number;
    healthEffort?: number;
    attackEffort?: number;
    defenseEffort?: number;
    specialAttackEffort?: number;
    specialDefenseEffort?: number;
    speedEffort?: number;
    catchRatio?: number;
    growExperience?: number;
    location?: number;

    spellList?: string[];
    id?: number;
    source?: PetProfile;
    targets?: PetProfile[];

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
            this.location;
    }

    parseName(name: string) {
        this.name = name;
        if (name.includes("(") && name.includes(")")) {
            this.code = StringUtils.substringBetween(name, "(", ")");
        }
    }

    get nameHtml() {
        return Pokemon.pokemonWikiReplacement(this.name);
    }

    get imageHtml() {
        const src = Constants.POCKET_DOMAIN + "/image/pet/" + this.picture;
        return "<img src='" + src + "' width='64' height='64' alt='" + this.code + "' style='border-width:0'>";
    }

    get locationText() {
        if (!this.location) {
            return "";
        }
        switch (this.location) {
            case 1:
                return "初森";
            case 2:
                return "中塔";
            case 3:
                return "上洞";
            default:
                return "";
        }
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

    spellText(): string {
        const code = StringUtils.substringBetween(this.name!, "(", ")");
        return MonsterSpellDict.loadSpells(code);
    }
}

export = PetProfile;