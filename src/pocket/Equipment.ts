class Equipment {

    index?: number;                      // 下标（唯一性）
    selectable?: boolean;                // 是否可以被选择
    using?: boolean;                     // 是否装备
    name?: string;                       // 名字
    star?: boolean;                      // 是否齐心
    nameHTML?: string;                   // 名字HTML代码
    category?: string;                   // 种类
    power?: number;                      // 效果
    weight?: number;                     // 重量
    endure?: number;                     // 耐久
    maxEndure?: number;                  // 最大耐久
    requiredCareer?: string;             // 装备需要的职业
    requiredAttack?: number;             // 装备需要的攻击力
    requiredDefense?: number;            // 装备需要的防御力
    requiredSpecialAttack?: number;      // 装备需要的智力
    requiredSpecialDefense?: number;     // 装备需要的精神力
    requiredSpeed?: number;              // 装备需要的速度
    experience?: number;                 // 经验
    additionalPower?: number;            // 附加威力
    additionalWeight?: number;           // 附加重量
    additionalLuck?: number;             // 附加幸运
    attribute?: string;                  // 属性
    price?: number;                      // 价格
    priceHTML?: string;                  // 价格HTML代码

    get isWeapon() {
        return this.category === "武器";
    }

    get isArmor() {
        return this.category === "防具";
    }

    get isAccessory() {
        return this.category === "饰品";
    }

    get isItem() {
        return this.category === "物品";
    }

    get isTreasureBag() {
        return this.isItem && this.name === "百宝袋";
    }

    get isGoldenCage() {
        return this.isItem && this.name === "黄金笼子";
    }
}

export = Equipment;