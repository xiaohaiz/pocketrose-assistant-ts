import _ from "lodash";
import StorageUtils from "../../util/StorageUtils";
import ButtonUtils from "../../util/ButtonUtils";

class TownDashboardShortcutManager {

    static getAvailableShortcutMappingIds(): string[] {
        return _.forEach(MAPPINGS).map(it => it.id);
    }

    static loadTownDashboardShortcutConfig() {
        let s = StorageUtils.getString("_pa_083");
        if (s === "") s = "{}";
        const document = JSON.parse(s);
        const config = new TownDashboardShortcutConfig();
        (document.id1) && (config.id1 = document.id1);
        (document.id2) && (config.id2 = document.id2);
        (document.id3) && (config.id3 = document.id3);
        (document.id4) && (config.id4 = document.id4);
        (document.id5) && (config.id5 = document.id5);
        (document.id6) && (config.id6 = document.id6);
        (document.id7) && (config.id7 = document.id7);
        (document.id8) && (config.id8 = document.id8);
        return config;
    }

    static findMapping(id: string | undefined | null) {
        if (!id || id === "禁用") return undefined;
        return MAPPINGS.find(it => it.id === id);
    }

}

class TownDashboardShortcutConfig {

    id1?: string;
    id2?: string;
    id3?: string;
    id4?: string;
    id5?: string;
    id6?: string;
    id7?: string;
    id8?: string;

    get actualId1() {
        return this.id1 ?? "图鉴";
    }

    get actualId2() {
        return this.id2 ?? "装备";
    }

    get actualId3() {
        return this.id3 ?? "宠物";
    }

    get actualId4() {
        return this.id4 ?? "职业";
    }

    get actualId5() {
        return this.id5 ?? "个人";
    }

    get actualId6() {
        return this.id6 ?? "团队";
    }

    get actualId7() {
        return this.id7 ?? "统计";
    }

    get actualId8() {
        return this.id8 ?? "设置";
    }

    getActualId(index: number) {
        switch (index) {
            case 1:
                return this.actualId1;
            case 2:
                return this.actualId2;
            case 3:
                return this.actualId3;
            case 4:
                return this.actualId4;
            case 5:
                return this.actualId5;
            case 6:
                return this.actualId6;
            case 7:
                return this.actualId7;
            case 8:
                return this.actualId8;
            default:
                return null;
        }
    }

    asDocument() {
        const document: any = {};
        (this.id1) && (document.id1 = this.id1);
        (this.id2) && (document.id2 = this.id2);
        (this.id3) && (document.id3 = this.id3);
        (this.id4) && (document.id4 = this.id4);
        (this.id5) && (document.id5 = this.id5);
        (this.id6) && (document.id6 = this.id6);
        (this.id7) && (document.id7 = this.id7);
        (this.id8) && (document.id8 = this.id8);
        return document;
    }
}

class ShortcutMapping {

    id: string;
    keyboard: string;
    option: string;

    constructor(id: string, keyboard: string, option: string) {
        this.id = id;
        this.keyboard = keyboard;
        this.option = option;
    }

    get buttonTitle() {
        let s = ButtonUtils.createTitle(this.id, this.keyboard);
        if (!_.includes(s, "(") && !_.includes(s, ")")) {
            s = "&nbsp;" + s + "&nbsp;";
        }
        return s;
    }
}

const MAPPINGS: ShortcutMapping[] = [

    new ShortcutMapping("驿站", "Esc", "INN"),                // 口袋驿站
    new ShortcutMapping("武器", "", "ARM_SHOP"),              // 武器商店
    new ShortcutMapping("防具", "", "PRO_SHOP"),              // 防具商店
    new ShortcutMapping("饰品", "", "ACC_SHOP"),              // 饰品商店
    new ShortcutMapping("宝石", "y", "BAOSHI_SHOP"),          // 宝石镶嵌
    new ShortcutMapping("修理", "", "MY_ARM"),                // 锻冶屋
    new ShortcutMapping("物品", "s", "ITEM_SHOP"),            // 物品商店
    new ShortcutMapping("银行", "b", "BANK"),                 // 口袋银行
    new ShortcutMapping("管家", "", "FREE_SELL"),             // 城堡管家
    new ShortcutMapping("个天", "k", "SINGLE_BATTLE"),        // 个人天真
    new ShortcutMapping("宠联", "p", "PET_TZ"),               // 宠联
    new ShortcutMapping("图鉴", "g", "PETMAP"),               // 宠物图鉴
    new ShortcutMapping("排行", "", "PETPROFILE"),            // 宠物排行榜
    new ShortcutMapping("任务", "", "TENNIS"),                // 任务指南
    new ShortcutMapping("冒险", "m", "CHANGEMAP"),            // 冒险家公会

    new ShortcutMapping("状态", "", "STATUS_PRINT"),          // 状态查看
    new ShortcutMapping("设置", "x", "LETTER"),               // 口袋助手设置
    new ShortcutMapping("统计", "j", "DIANMING"),             // 统计报告
    new ShortcutMapping("团队", "t", "BATTLE_MES"),           // 团队面板
    new ShortcutMapping("装备", "e", "USE_ITEM"),             // 装备管理
    new ShortcutMapping("宠物", "u", "PETSTATUS"),            // 宠物管理
    new ShortcutMapping("职业", "z", "CHANGE_OCCUPATION"),    // 职业管理
    new ShortcutMapping("分身", "", "FENSHENSHIGUAN"),        // 分身管理
    new ShortcutMapping("个人", "i", "RANK_REMAKE"),          // 个人面板
    new ShortcutMapping("手册", "", "COU_MAKE"),              // 使用手册
    new ShortcutMapping("管理", "", "CHUJIA"),                // 团队管理

];

export {TownDashboardShortcutManager, TownDashboardShortcutConfig, ShortcutMapping};