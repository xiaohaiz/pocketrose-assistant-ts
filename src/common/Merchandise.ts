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

    get categoryHtml(): string {
        if (this.category === "武器") {
            return "<span style='color:blue'>" + this.category + "</span>";
        } else if (this.category === "防具") {
            return "<span style='color:red'>" + this.category + "</span>";
        } else if (this.category === "饰品") {
            return "<span style='color:green'>" + this.category + "</span>";
        } else {
            return this.category!;
        }
    }
}

export = Merchandise;