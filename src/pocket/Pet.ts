import Constants from "../util/Constants";
import SetupLoader from "../core/SetupLoader";
import PageUtils from "../util/PageUtils";

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

    get imageHtml() {
        const src = Constants.POCKET_DOMAIN + "/image/pet/" + this.picture;
        return "<img src='" + src + "' width='64' height='64' alt='" + this.race + "' style='border-width:0'>";
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
        return "<span title='" + ("LV " + this.level) + "'>" + progressBar + "</span>";
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
}

export = Pet;