import _ from "lodash";

class TreasureLoader {

    static getCode(treasureName: string): number {
        // @ts-ignore
        const code = TREASURES[treasureName];
        return code === undefined ? 0 : code;
    }

    static getCodeAsString(treasureName: string) {
        let s = TreasureLoader.getCode(treasureName).toString();
        return _.padStart(s, 3, "0");
    }

    static allTreasureNames() {
        return Object.keys(TREASURES);
    }
}

// ----------------------------------------------------------------------------
// 顺序不能调整
// ----------------------------------------------------------------------------
const TREASURES = {
    "其他": 0,

    "神枪 永恒": 1,
    "霸邪斧 天煌": 2,
    "魔刀 哭杀": 3,
    "神器 苍穹": 4,
    "魔神器 幻空": 5,
    "真·圣剑 苍白的正义": 6,
    "双经斩": 7,

    "千幻碧水猿洛克奇斯": 8,
    "地纹玄甲龟斯特奥特斯": 9,
    "幽冥黑鳞蟒罗尼科斯": 10,
    "火睛混沌兽哈贝达": 11,
    "羽翅圣光虎阿基勒斯": 12,
    "金翅追日鹰庞塔雷斯": 13,
    "风翼三足凤纳托利斯": 14,
    "圣皇铠甲 天威": 15,
    "薄翼甲": 16,

    "魔盔 虚无": 17,
    "神冠 灵通": 18,
    "龙": 19,
    "王道仙人玉佩": 20,
    "王道倚天玉佩": 21,
    "王道军神玉佩": 22,
    "王道疾风玉佩": 23,
    "王道磐石玉佩": 24,
    "霸者仙人玉佩": 25,
    "霸者倚天玉佩": 26,
    "霸者军神玉佩": 27,
    "霸者疾风玉佩": 28,
    "霸者磐石玉佩": 29,

    "大师球": 30,
    "充满幸福憧憬的婚纱": 31,
    "30T砸屏专用槌": 32,
    "Armani西装": 33,
    "Hermès围巾": 34,
    "PS3": 35,
    "UGG": 36,
    "XBOX360": 37,
    "burberry风衣": 38,
    "ipad4": 39,
    "iphone5": 40,
    "去死去死团团服": 41,
    "好人卡": 42,
    "情人套装（女式）": 43,
    "情人套装（男式）": 44,
    "情侣表（女式）": 45,
    "情侣表（男式）": 46,
    "折凳": 47,
    "蟠龙花瓶": 48,
    "达尔文奖荣誉勋章": 49,

    "藏宝图": 50,
    "威力宝石": 51,
    "重量宝石": 52,
    "幸运宝石": 53,
}

export = TreasureLoader;