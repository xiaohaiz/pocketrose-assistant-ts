class BattlePage {

    treasureBattle?: boolean;       // 秘宝之岛
    primaryBattle?: boolean;        // 初级之森
    juniorBattle?: boolean;         // 中级之塔
    seniorBattle?: boolean;         // 上级之洞窟
    zodiacBattle?: boolean;         // 十二神殿
    lowestEndure?: number;          // 战斗后装备剩余最低耐久度（排除大师球、宗师球、超力怪兽球、宠物蛋）
    roleHealth?: number;            // 角色剩余生命
    roleMaxHealth?: number;         // 角色最大生命
    roleMana?: number;              // 角色剩余魔力
    roleMaxMana?: number;           // 角色最大魔力
    monsterHealth?: number;         // 怪物剩余生命
    battleResult?: string;          // 战斗结果
    harvestList?: string[];         // 入手列表

    constructor() {
        this.treasureBattle = false;
        this.primaryBattle = false;
        this.juniorBattle = false;
        this.seniorBattle = false;
        this.zodiacBattle = false;
        this.lowestEndure = 999;
    }
}

export = BattlePage;