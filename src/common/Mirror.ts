import Constants from "../util/Constants";

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
}

export = Mirror;