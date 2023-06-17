class BattlePage {

    treasureBattle?: boolean;       // 秘宝之岛
    primaryBattle?: boolean;        // 初级之森
    juniorBattle?: boolean;         // 中级之塔
    seniorBattle?: boolean;         // 上级之洞窟
    zodiacBattle?: boolean;         // 十二神殿
    petUpgrade?: boolean;           // 宠物是否升级
    lowestEndure?: number;          // 战斗后装备剩余最低耐久度（排除大师球、宗师球、超力怪兽球、宠物蛋）
    roleHealth?: number;            // 角色剩余生命
    roleMaxHealth?: number;         // 角色最大生命
    roleMana?: number;              // 角色剩余魔力
    roleMaxMana?: number;           // 角色最大魔力
    monsterHealth?: number;         // 怪物剩余生命
    monsterMaxHealth?: number;      // 怪物最大生命
    battleResult?: string;          // 战斗结果
    harvestList?: string[];         // 入手列表
    eggBorn?: boolean;              // 孵化成功
    monsterTask?: boolean;          // 杀怪任务
    petLearnSpell?: boolean;        // 宠物是否学会新技能

    roleImageHtml?: string;
    roleNameHtml?: string;
    petImageHtml?: string;
    petNameHtml?: string;
    monsterImageHtml?: string;
    monsterNameHtml?: string;
    reportHtml?: string;

    additionalRP?: number;

    constructor() {
        this.treasureBattle = false;
        this.primaryBattle = false;
        this.juniorBattle = false;
        this.seniorBattle = false;
        this.zodiacBattle = false;
        this.petUpgrade = false;
        this.lowestEndure = 999;
    }

    get battleField() {
        if (this.treasureBattle) {
            return "＜ 秘 宝 之 岛 ＞";
        }
        if (this.primaryBattle) {
            return "＜ 初 级 之 森 ＞";
        }
        if (this.juniorBattle) {
            return "＜ 中 级 之 塔 ＞";
        }
        if (this.seniorBattle) {
            return "＜ 上 级 之 洞 窟 ＞";
        }
        if (this.zodiacBattle) {
            return "＜ 十 二 神 殿 ＞";
        }
        return "UNKNOWN";
    }

}

export = BattlePage;