import Constants from "../util/Constants";

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


    get imageHtml() {
        const src = Constants.POCKET_DOMAIN + "/image/pet/" + this.picture;
        return "<img src='" + src + "' width='64' height='64' alt='" + this.code + "' style='border-width:0'>";
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

}

export = PetProfile;