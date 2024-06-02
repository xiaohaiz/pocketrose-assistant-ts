import _ from "lodash";

class WeaponSkill {

    name?: string;
    code?: string;
    rankHTML?: string;
    level?: number;
    experience?: number;


    get fullName() {
        return this.name + "(" + this.code + ")";
    }

    get fullLevel() {
        const l = _.padStart(this.level?.toString(), 2, "0");
        const e = _.padStart(this.experience?.toString(), 5, "0");
        return "等级：" + l + " / 经验：" + e;
    }

}

export = WeaponSkill;