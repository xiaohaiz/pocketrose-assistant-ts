/**
 * 商店售卖商品的数据结构描述
 */
class Merchandise {

    id?: string;
    category?: string;
    name?: string;
    nameHtml?: string;
    price?: number;
    power?: number;
    weight?: number;
    endure?: number;
    attribute?: string;
    requiredCareer?: string;             // 需要的职业
    requiredAttack?: number;             // 需要的攻击力
    requiredDefense?: number;            // 需要的防御力
    requiredSpecialAttack?: number;      // 需要的智力
    requiredSpecialDefense?: number;     // 需要的精神力
    requiredSpeed?: number;              // 需要的速度
    weaponCategory?: string;             // 武器类型
    gemCount?: number;                   // 可镶嵌宝石数
    speciality?: boolean;                // 特产商品

    get index(): number {
        return parseInt(this.id!.split("_")[1]);
    }

    get priceHtml() {
        if (this.price === undefined) {
            return "-";
        }
        if (this.price >= 10000000) {
            return "<span style='color:gold;background-color:darkblue'>" + this.price + "</span> GOLD";
        } else {
            return this.price + " GOLD";
        }
    }

    get endureHtml() {
        if (this.endure === undefined || this.endure === 1) {
            return "-";
        } else {
            return this.endure.toString();
        }
    }

    get requiredCareerHtml() {
        if (this.requiredCareer === undefined || this.requiredCareer === "所有职业") {
            return "-";
        } else {
            return this.requiredCareer;
        }
    }

    get requiredAttackHtml() {
        if (this.requiredAttack === undefined || this.requiredAttack === 0) {
            return "-";
        } else {
            if (this.requiredAttack >= 375) {
                return "<span title='倚天' style='color:red'>" + this.requiredAttack + "</span>";
            } else {
                return this.requiredAttack.toString();
            }
        }
    }

    get requiredDefenseHtml() {
        if (this.requiredDefense === undefined || this.requiredDefense === 0) {
            return "-";
        } else {
            if (this.requiredDefense >= 375) {
                return "<span title='磐石' style='color:red'>" + this.requiredDefense + "</span>";
            } else {
                return this.requiredDefense.toString();
            }
        }
    }

    get requiredSpecialAttackHtml() {
        if (this.requiredSpecialAttack === undefined || this.requiredSpecialAttack === 0) {
            return "-";
        } else {
            if (this.requiredSpecialAttack >= 375) {
                return "<span title='仙人' style='color:red'>" + this.requiredSpecialAttack + "</span>";
            } else {
                return this.requiredSpecialAttack.toString();
            }
        }
    }

    get requiredSpecialDefenseHtml() {
        if (this.requiredSpecialDefense === undefined || this.requiredSpecialDefense === 0) {
            return "-";
        } else {
            if (this.requiredSpecialDefense >= 375) {
                return "<span title='军神' style='color:red'>" + this.requiredSpecialDefense + "</span>";
            } else {
                return this.requiredSpecialDefense.toString();
            }
        }
    }

    get requiredSpeedHtml() {
        if (this.requiredSpecialDefense === undefined || this.requiredSpeed === 0) {
            return "-";
        } else {
            if (this.requiredSpecialDefense >= 375) {
                return "<span title='疾风' style='color:red'>" + this.requiredSpecialDefense + "</span>";
            } else {
                return this.requiredSpecialDefense.toString();
            }
        }
    }

    get gemCountHtml() {
        if (this.gemCount === undefined || this.gemCount === 0) {
            return "-";
        } else {
            return this.gemCount.toString();
        }
    }

    get specialityHtml() {
        if (this.speciality === undefined || !this.speciality) {
            return "";
        } else {
            return "★";
        }
    }
}

export = Merchandise;