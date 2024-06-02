import EquipmentProfile from "./EquipmentProfile";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import {Equipment} from "./Equipment";

class EquipmentProfileLoader {

    static loadEquipmentProfile(s: string | null | undefined): EquipmentProfile | null {
        if (!s) return null;
        let id = s;
        if (_.startsWith(s, "齐心★")) {
            id = StringUtils.substringAfter(s, "齐心★");
        }
        const profile = EQUIPMENT_PROFILES[id];
        return profile === undefined ? null : profile;
    }

    static loadAsEquipments(): Equipment[] {
        const equipments: Equipment[] = [];
        for (const value of Object.values(EQUIPMENT_PROFILES)) {
            const profile = value as EquipmentProfile;
            const equipment = new Equipment();
            equipment.name = profile.name;
            equipment.category = profile.category;
            equipment.power = profile.power;
            equipment.weight = profile.weight;
            if (equipment.name === "千幻碧水猿洛克奇斯") equipment.attribute = "水";
            if (equipment.name === "地纹玄甲龟斯特奥特斯") equipment.attribute = "土";
            if (equipment.name === "幽冥黑鳞蟒罗尼科斯") equipment.attribute = "暗";
            if (equipment.name === "火睛混沌兽哈贝达") equipment.attribute = "火";
            if (equipment.name === "羽翅圣光虎阿基勒斯") equipment.attribute = "光";
            if (equipment.name === "金翅追日鹰庞塔雷斯") equipment.attribute = "金";
            if (equipment.name === "风翼三足凤纳托利斯") equipment.attribute = "风";
            equipments.push(equipment);
        }
        return equipments;
    }

    static loadRecoverItemNames() {
        return RECOVER_ITEMS;
    }

    static loadTrashEquipmentNames() {
        return TRASH_EQUIPMENTS;
    }

    static isRecoverItem(name: string | undefined) {
        return name !== undefined && RECOVER_ITEMS.includes(name);
    }

    static isTrashEquipment(name: string | undefined) {
        return name !== undefined && TRASH_EQUIPMENTS.includes(name);
    }
}

const EQUIPMENT_PROFILES: any = {
    "神枪 永恒": new EquipmentProfile("神枪 永恒", "武器", 388, 99, 300, 10, false, true, true, true),
    "霸邪斧 天煌": new EquipmentProfile("霸邪斧 天煌", "武器", 333, 64, 300, 10, false, true, true, true),
    "神器 苍穹": new EquipmentProfile("神器 苍穹", "武器", 325, 53, 300, 10, false, true, true, true),
    "魔刀 哭杀": new EquipmentProfile("魔刀 哭杀", "武器", 313, 56, 300, 15, false, true, true, true),
    "魔神器 幻空": new EquipmentProfile("魔神器 幻空", "武器", 310, 51, 300, 10, false, true, true, true),
    "真·圣剑 苍白的正义": new EquipmentProfile("真·圣剑 苍白的正义", "武器", 280, 26, 350, 5, false, true, true, true),
    "双经斩": new EquipmentProfile("双经斩", "武器", 200, 50, 200, 20, false, true, false, true),
    "1.5倍界王拳套": new EquipmentProfile("1.5倍界王拳套", "武器", 100, 50, 300, 20, false, true, false, false),
    "九齿钉耙": new EquipmentProfile("九齿钉耙", "武器", 0, 0, 999, 0, true, true, false, false),
    "降魔杖": new EquipmentProfile("降魔杖", "武器", 0, 0, 999, 0, true, true, false, false),
    "千幻碧水猿洛克奇斯": new EquipmentProfile("千幻碧水猿洛克奇斯", "防具", 255, 150, 600, 7, false, true, true, true),
    "地纹玄甲龟斯特奥特斯": new EquipmentProfile("地纹玄甲龟斯特奥特斯", "防具", 255, 150, 600, 7, false, true, true, true),
    "幽冥黑鳞蟒罗尼科斯": new EquipmentProfile("幽冥黑鳞蟒罗尼科斯", "防具", 255, 150, 600, 7, false, true, true, true),
    "火睛混沌兽哈贝达": new EquipmentProfile("火睛混沌兽哈贝达", "防具", 255, 150, 600, 7, false, true, true, true),
    "羽翅圣光虎阿基勒斯": new EquipmentProfile("羽翅圣光虎阿基勒斯", "防具", 255, 150, 600, 7, false, true, true, true),
    "金翅追日鹰庞塔雷斯": new EquipmentProfile("金翅追日鹰庞塔雷斯", "防具", 255, 150, 600, 7, false, true, true, true),
    "风翼三足凤纳托利斯": new EquipmentProfile("风翼三足凤纳托利斯", "防具", 255, 150, 600, 7, false, true, true, true),
    "圣皇铠甲 天威": new EquipmentProfile("圣皇铠甲 天威", "防具", 325, 82, 900, 10, false, true, true, true),
    "薄翼甲": new EquipmentProfile("薄翼甲", "防具", 100, 10, 300, 2, false, true, true, true),
    "魔盔 虚无": new EquipmentProfile("魔盔 虚无", "饰品", 211, 52, 500, 15, false, true, true, true),
    "神冠 灵通": new EquipmentProfile("神冠 灵通", "饰品", 150, 25, 500, 5, false, true, true, true),
    "龙": new EquipmentProfile("龙", "饰品", 20, -14, 300, 1, false, true, true, true),
    "千与千寻": new EquipmentProfile("千与千寻", "饰品", -20, 10, 999, 0, false, true, false, false),
    "勿忘我": new EquipmentProfile("勿忘我", "饰品", 0, 0, 999, 0, false, true, false, false),
    "魔法使的闪光弹": new EquipmentProfile("魔法使的闪光弹", "饰品", 0, 0, 199, 0, true, true, false, false),
    "去死去死团团服": new EquipmentProfile("去死去死团团服", "防具", 0, 0, 999, 30, true, true, true, true),
    "情人套装（男式）": new EquipmentProfile("情人套装（男式）", "防具", 0, 0, 999, 30, true, true, true, true),
    "情人套装（女式）": new EquipmentProfile("情人套装（女式）", "防具", 0, 0, 999, 30, true, true, true, true),
    "情侣表（男式）": new EquipmentProfile("情侣表（男式）", "饰品", 0, 0, 999, 30, true, true, true, true),
    "情侣表（女式）": new EquipmentProfile("情侣表（女式）", "饰品", 0, 0, 999, 30, true, true, true, true),
    "好人卡": new EquipmentProfile("好人卡", "饰品", 0, 0, 999, 30, true, true, true, true),
    "蟠龙花瓶": new EquipmentProfile("蟠龙花瓶", "饰品", 0, 0, 999, 30, true, true, true, true),
    "UGG": new EquipmentProfile("UGG", "饰品", 0, 0, 999, 30, true, true, true, true),
    "Hermès围巾": new EquipmentProfile("Hermès围巾", "饰品", 0, 0, 999, 30, true, true, true, true),
    "30T砸屏专用槌": new EquipmentProfile("30T砸屏专用槌", "武器", 0, 0, 999, 30, true, true, true, true),
    "折凳": new EquipmentProfile("折凳", "武器", 0, 0, 999, 30, true, true, true, true),
    "XBOX360": new EquipmentProfile("XBOX360", "武器", 0, 0, 999, 30, true, true, true, true),
    "充满幸福憧憬的婚纱": new EquipmentProfile("充满幸福憧憬的婚纱", "防具", 0, 0, 999, 5, true, true, true, true),
    "圣枪 隆基诺斯": new EquipmentProfile("圣枪 隆基诺斯", "武器", 283, 32, 250, 5, true, true, true, false),
    "斗神铠 狂狱": new EquipmentProfile("斗神铠 狂狱", "防具", 217, 50, 300, 5, true, true, true, false),
    "炙雷之斧": new EquipmentProfile("炙雷之斧", "武器", 162, 51, 300, 5, true, true, true, false),
    "枭之甲": new EquipmentProfile("枭之甲", "防具", 150, 40, 200, 5, true, true, true, false),
    "鬼面": new EquipmentProfile("鬼面", "饰品", 140, 60, 200, 1, true, true, true, false),
    "幻衣 夕雾": new EquipmentProfile("幻衣 夕雾", "防具", 57, 6, 300, 5, true, true, true, false),
    "极光之翼": new EquipmentProfile("极光之翼", "饰品", 34, 5, 200, 5, true, true, true, false),
    "圣衣 苍羽": new EquipmentProfile("圣衣 苍羽", "防具", 120, 22, 250, 5, true, true, true, false),
    "怨灵邪衣": new EquipmentProfile("怨灵邪衣", "防具", 110, 20, 250, 5, true, true, true, false),
    "咒袍 孤星": new EquipmentProfile("咒袍 孤星", "防具", 59, 8, 300, 5, true, true, true, false),
    "王者之靴 圣踏": new EquipmentProfile("王者之靴 圣踏", "饰品", 160, 40, 300, 5, true, true, true, false),
    "晶之冠": new EquipmentProfile("晶之冠", "饰品", 80, 13, 200, 5, true, true, true, false),
    "魔炎战盔": new EquipmentProfile("魔炎战盔", "饰品", 70, 10, 200, 5, true, true, true, false),
    "极光护轮": new EquipmentProfile("极光护轮", "饰品", 55, 8, 200, 5, true, true, true, false),
    "月牙之戒": new EquipmentProfile("月牙之戒", "饰品", 30, 3, 200, 5, true, true, true, false),
};

const RECOVER_ITEMS = [
    "药草",
    "当归",
    "雪莲",
    "鹿茸",
    "人参",
    "大还丹",
];

const TRASH_EQUIPMENTS = [
    "腰刀",
    "支配者之杖",
    "异域镇魂剑",
    "银光双手剑",
    "瞬风之枪",
    "猫爪",
    "残月弯刀",
    "石矛枪",
    "荡寇双刃剑",
    "罗马剑 ",         // 坑爹啊，罗马剑后面多了一个空格
    "弯剑",
    "重剑",
    "匕首",
    "布衣",
    "丝衣",
    "皮衣",
    "主教斗篷",
    "皮甲",
    "软皮半身甲",
    "鳞甲",
    "青铜甲",
    "暗影甲衬",
    "头巾",
    "方巾",
    "皮帽",
    "重装头盔",
    "狂战士头盔",
    "波斯弯刀",
    "刺馈剑",
    "世界树之枝",
    "夺魂冰钩",
    "奥利哈钢匕首",
    "夜魔披风",
    "逆魔道袍",
    "犰狳铁皮甲",
    "修罗轻衣",
    "雷之法袍",
    "吟游诗人双面上装",
    "孔雀袍",
    "羽毛帽",
    "头带",
    "司祭头环",
    "铁制头盔",
    "红头巾",
    "锁子鳞甲",
];

export = EquipmentProfileLoader;