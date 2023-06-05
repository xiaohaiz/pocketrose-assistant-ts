class ExtensionShortcutLoader {

    static getExtensionShortcut(id: number): string[] | null {
        // @ts-ignore
        const value = EXT_SHORTCUTS[id];
        if (value === undefined) {
            return null;
        }
        return value;
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
    9: ["快速登陆", "CHUJIA"],
    10: ["宠物联赛", "PET_TZ"],
    11: ["宠物排行", "PETPROFILE"],
    12: ["城市收益", "MAKE_TOWN"],
    13: ["养精蓄锐", ""],
    14: ["统计报告", "DIANMING"],
};

export = ExtensionShortcutLoader;