import _ from "lodash";

class ExtensionShortcutLoader {

    static getExtensionShortcut(id: number): string[] | null {
        // @ts-ignore
        const value = EXT_SHORTCUTS[id];
        if (value === undefined) {
            return null;
        }
        return value;
    }

    static listAll() {
        const list: [][] = [];
        Object.keys(EXT_SHORTCUTS)
            .map(it => _.parseInt(it))
            .sort((a, b) => a - b)
            .forEach(id => {
                // @ts-ignore
                const value = EXT_SHORTCUTS[id]!;
                // @ts-ignore
                list.push([value[0], id]);
            });
        return list;
    }

}

const EXT_SHORTCUTS = {
    1: ["使用手册", "COU_MAKE"],
    2: ["口袋驿站", "INN"],
    3: ["武器商店", "ARM_SHOP"],
    4: ["防具商店", "PRO_SHOP"],
    5: ["饰品商店", "ACC_SHOP"],
    6: ["物品商店", "ITEM_SHOP"],
    7: ["宝石镶嵌", "BAOSHI_SHOP"],
    8: ["冒险公会", "CHANGEMAP"],
    9: ["团队管理", "CHUJIA"],
    10: ["宠物联赛", "PET_TZ"],
    11: ["宠物排行", "PETPROFILE"],
    12: ["装备修理", "MY_ARM"],
    13: ["养精蓄锐", ""],
    14: ["统计报告", "DIANMING"],
};

export = ExtensionShortcutLoader;