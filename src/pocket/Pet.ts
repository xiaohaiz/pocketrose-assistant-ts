import Constants from "../util/Constants";

class Pet {

    index?: number;                  // 下标（唯一性）
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
    love?: number;
    attribute1?: string;
    attribute2?: string;
    race?: string;
    code?: string;

    get imageHtml() {
        const src = Constants.DOMAIN + "/image/pet/" + this.picture;
        return "<img src='" + src + "' width='64' height='64' alt='" + this.race + "' style='border-width:0'>";
    }
}

export = Pet;