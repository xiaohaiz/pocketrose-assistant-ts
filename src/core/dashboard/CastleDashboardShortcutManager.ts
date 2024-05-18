import _ from "lodash";
import StorageUtils from "../../util/StorageUtils";
import {ShortcutMapping} from "./TownDashboardShortcutManager";

class CastleDashboardShortcutManager {

    static getAvailableShortcutMappingIds(): string[] {
        return _.forEach(MAPPINGS).map(it => it.id);
    }

    static loadCastleDashboardShortcutConfig() {
        let s = StorageUtils.getString("_pa_084");
        if (s === "") s = "{}";
        const document = JSON.parse(s);
        const config = new CastleDashboardShortcutConfig();
        (document.id1) && (config.id1 = document.id1);
        (document.id2) && (config.id2 = document.id2);
        (document.id3) && (config.id3 = document.id3);
        (document.id4) && (config.id4 = document.id4);
        (document.id5) && (config.id5 = document.id5);
        (document.id6) && (config.id6 = document.id6);
        return config;
    }

    static findMapping(id: string | undefined | null) {
        if (!id || id === "禁用") return undefined;
        return MAPPINGS.find(it => it.id === id);
    }

}

class CastleDashboardShortcutConfig {

    id1?: string;
    id2?: string;
    id3?: string;
    id4?: string;
    id5?: string;
    id6?: string;

    get actualId1() {
        return this.id1 ?? "装备";
    }

    get actualId2() {
        return this.id2 ?? "宠物";
    }

    get actualId3() {
        return this.id3 ?? "开发";
    }

    get actualId4() {
        return this.id4 ?? "个人";
    }

    get actualId5() {
        return this.id5 ?? "团队";
    }

    get actualId6() {
        return this.id6 ?? "设置";
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
        return document;
    }
}

const MAPPINGS: ShortcutMapping[] = [

    new ShortcutMapping("驿站", "Esc", "CASTLE_INN"),         // 城堡驿站
    new ShortcutMapping("银行", "b", "CASTLE_BANK"),          // 口袋银行
    new ShortcutMapping("状态", "", "STATUS_PRINT"),          // 状态查看
    new ShortcutMapping("设置", "x", "LETTER"),               // 口袋助手设置
    new ShortcutMapping("统计", "j", "DIANMING"),             // 统计报告
    new ShortcutMapping("团队", "t", "BATTLE_MES"),           // 团队面板
    new ShortcutMapping("装备", "e", "USE_ITEM"),             // 装备管理
    new ShortcutMapping("宠物", "u", "PETSTATUS"),            // 宠物管理
    new ShortcutMapping("职业", "z", "CHANGE_OCCUPATION"),    // 职业管理
    new ShortcutMapping("个人", "i", "RANK_REMAKE"),          // 个人面板
    new ShortcutMapping("开发", "", "CASTLE_DEVELOP"),        // 个人面板

];

export {CastleDashboardShortcutManager, CastleDashboardShortcutConfig, ShortcutMapping};