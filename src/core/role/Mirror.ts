import Constants from "../../util/Constants";
import _ from "lodash";

class Mirror {

    index?: number;
    category?: string;
    image?: string;
    name?: string;
    gender?: string;
    health?: number;
    maxHealth?: number;
    mana?: number;
    maxMana?: number;
    attribute?: string;
    attack?: number;
    defense?: number;
    specialAttack?: number;
    specialDefense?: number;
    speed?: number;
    career?: string;
    spell?: string;
    experience?: number;
    using?: boolean;

    get imageHtml(): string {
        const src = Constants.POCKET_DOMAIN + "/image/head/" + this.image;
        return "<img src='" + src + "' alt='" + this.name + "' width='64' height='64'>";
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

    get experienceHtml(): string {
        if (this.experience! >= 14900) {
            return "<span style='color:red' title='" + this.experience + "'>MAX</span>";
        } else {
            return this.experience!.toString();
        }
    }

    get level(): number {
        return (_.floor(this.experience! / 100)) + 1;
    }
}

export = Mirror;