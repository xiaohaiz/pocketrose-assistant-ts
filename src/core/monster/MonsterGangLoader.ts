import _ from "lodash";

class MonsterGangLoader {

    static inGang1(monster: string): boolean {
        return G_1.includes(monster);
    }

    static inGang2(monster: string): boolean {
        return G_2.includes(monster);
    }

    static getGang1(): string[] {
        return _.clone(G_1);
    }

    static getGang2(): string[] {
        return _.clone(G_2);
    }
}

// ----------------------------------------------------------------------------
// 四 天 王
// ----------------------------------------------------------------------------
const G_1: string[] = [
    "巴大蝴(012)",
    "火精灵(136)",
    "石章鱼(224)",
    "火鸡战士(257)",
];

// ----------------------------------------------------------------------------
// 杰 德 天 团
// ----------------------------------------------------------------------------
const G_2: string[] = [
    "双钳龙虾(341)",
    "钢钳龙虾(342)",
    "热带雷龙(357)",
    "由基瓦拉(361)",
    "巨头冰怪(362)",
    "海象牙王(365)",
    "尖头鳗(368)",
    "血翼飞龙(373)",
    "钢铁螃蟹(376)",
    "钢神柱(379)",
];

export = MonsterGangLoader;