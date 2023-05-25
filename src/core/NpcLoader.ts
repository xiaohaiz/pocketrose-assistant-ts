import Constants from "../util/Constants";
import RandomUtils from "../util/RandomUtils";
import StringUtils from "../util/StringUtils";

class NpcLoader {

    static getNpcImageHtml(name: string) {
        // @ts-ignore
        const image = POCKET_NPC_IMAGES[name];
        if (image === undefined) {
            return null;
        }
        let id;
        if (name.startsWith("M_") || name.startsWith("F_") || name.startsWith("U_")) {
            id = name;
        } else {
            let s = StringUtils.substringAfterLast(image, "/");
            id = StringUtils.substringBefore(s, ".gif");
            id = "p_" + id;
        }
        return "<img src='" + image + "' width='64' height='64' alt='" + name + "' id='" + id + "'>";
    }

    static randomMaleNpcImageHtml() {
        const names: string[] = [];
        Object.keys(POCKET_NPC_IMAGES)
            .filter(value => value.startsWith("M_"))
            .forEach(value => names.push(value));
        const name = RandomUtils.randomElement(names)!;
        return NpcLoader.getNpcImageHtml(name)!;
    }

    static randomFemaleNpcImageHtml() {
        const names: string[] = [];
        Object.keys(POCKET_NPC_IMAGES)
            .filter(value => value.startsWith("F_"))
            .forEach(value => names.push(value));
        const name = RandomUtils.randomElement(names)!;
        return NpcLoader.getNpcImageHtml(name)!;
    }

    static randomNpcImageHtml() {
        const names: string[] = [];
        Object.keys(POCKET_NPC_IMAGES)
            .filter(value => value.startsWith("M_") || value.startsWith("F_") || value.startsWith("U_"))
            .forEach(value => names.push(value));
        const name = RandomUtils.randomElement(names)!;
        return NpcLoader.getNpcImageHtml(name)!;
    }

    static randomPlayerImageHtml() {
        const names: string[] = [];
        Object.keys(POCKET_NPC_IMAGES)
            .filter(value => !value.startsWith("M_") && !value.startsWith("F_") && !value.startsWith("U_"))
            .forEach(value => names.push(value));
        const name = RandomUtils.randomElement(names)!;
        return NpcLoader.getNpcImageHtml(name)!;
    }

    static playerNpcNames(): string[] {
        const names: string[] = [];
        Object.keys(POCKET_NPC_IMAGES)
            .filter(value => !value.startsWith("M_") && !value.startsWith("F_") && !value.startsWith("U_"))
            .forEach(value => names.push(value));
        return names;
    }

    static getTaskNpcImageHtml(name: string) {
        // @ts-ignore
        const image = POCKET_TASK_NPC_IMAGES[name];
        if (image === undefined) {
            return null;
        }
        let s = StringUtils.substringAfterLast(image, "/");
        let id = StringUtils.substringBefore(s, ".");
        id = "n_" + id;
        return "<img src='" + image + "' width='64' height='64' alt='" + name + "' id='" + id + "'>";
    }
}

const POCKET_TASK_NPC_IMAGES = {
    "瓦格纳": Constants.POCKET_DOMAIN + "/image/npc/005.jpg",      // 7,10
    "吕布": Constants.POCKET_DOMAIN + "/image/npc/293.jpg",       // 8,11
    "庞统": Constants.POCKET_DOMAIN + "/image/npc/348.jpg",       // 7,7
    "司马懿": Constants.POCKET_DOMAIN + "/image/npc/395.jpg",       // 3,11
    "赵云": Constants.POCKET_DOMAIN + "/image/npc/657.jpg",       // 8,11
    "诸葛亮": Constants.POCKET_DOMAIN + "/image/npc/684.jpg",      // 6,6
    "蒋干": Constants.POCKET_DOMAIN + "/image/npc/211.jpg",      // 8,5
    "黄盖": Constants.POCKET_DOMAIN + "/image/npc/193.jpg",      // 8,5
    "周瑜": Constants.POCKET_DOMAIN + "/image/npc/669.jpg",      // 8,5
    "曹操": Constants.POCKET_DOMAIN + "/image/npc/018.jpg",      // 8,5
    "关羽": Constants.POCKET_DOMAIN + "/image/npc/142.jpg",      // 5,5
    "吕蒙": Constants.POCKET_DOMAIN + "/image/npc/299.jpg",      // 5,5
    "徐晃": Constants.POCKET_DOMAIN + "/image/npc/536.jpg",      // 5,5

    "孟获": Constants.POCKET_DOMAIN + "/image/npc/326.jpg",      // 0,4
    "董荼那": Constants.POCKET_DOMAIN + "/image/npc/093.jpg",      // 0,4
    "孟优": Constants.POCKET_DOMAIN + "/image/npc/327.jpg",      // 0,4
    "带来洞主": Constants.POCKET_DOMAIN + "/image/npc/070.jpg",      // 0,4
    "祝融": Constants.POCKET_DOMAIN + "/image/npc/688.jpg",      // 0,4

    "黄忠": Constants.POCKET_DOMAIN + "/image/npc/197.jpg",      // 7,4
    "张飞": Constants.POCKET_DOMAIN + "/image/npc/611.jpg",      // 10,7
    "马超": Constants.POCKET_DOMAIN + "/image/npc/306.jpg",      // 1,14

    "孔秀": Constants.POCKET_DOMAIN + "/image/npc/699.jpg",      // 7,9
    "孟坦": Constants.POCKET_DOMAIN + "/image/npc/699.jpg",      // 6,9
    "韩福": Constants.POCKET_DOMAIN + "/image/npc/699.jpg",      // 6,9
    "卞喜": Constants.POCKET_DOMAIN + "/image/npc/699.jpg",      // 7,10
    "王植": Constants.POCKET_DOMAIN + "/image/npc/699.jpg",      // 8,10
    "秦琪": Constants.POCKET_DOMAIN + "/image/npc/699.jpg",      // 9,10
    "东方不败": Constants.POCKET_DOMAIN + "/image/npc/dfbb.jpg",      // 5,10
};

const POCKET_NPC_IMAGES = {

    "M_000": Constants.POCKET_DOMAIN + "/image/etc/0.gif",
    "M_001": Constants.POCKET_DOMAIN + "/image/etc/1.gif",
    "M_002": Constants.POCKET_DOMAIN + "/image/etc/2.gif",
    "M_003": Constants.POCKET_DOMAIN + "/image/etc/3.gif",
    "M_004": Constants.POCKET_DOMAIN + "/image/etc/4.gif",
    "M_005": Constants.POCKET_DOMAIN + "/image/etc/5.gif",
    "M_006": Constants.POCKET_DOMAIN + "/image/etc/6.gif",
    "M_007": Constants.POCKET_DOMAIN + "/image/etc/7.gif",
    "M_008": Constants.POCKET_DOMAIN + "/image/etc/8.gif",
    "M_009": Constants.POCKET_DOMAIN + "/image/etc/9.gif",
    "M_011": Constants.POCKET_DOMAIN + "/image/etc/11.gif",
    "M_012": Constants.POCKET_DOMAIN + "/image/etc/12.gif",
    "M_013": Constants.POCKET_DOMAIN + "/image/etc/13.gif",
    "M_014": Constants.POCKET_DOMAIN + "/image/etc/14.gif",
    "M_015": Constants.POCKET_DOMAIN + "/image/etc/15.gif",
    "M_016": Constants.POCKET_DOMAIN + "/image/etc/16.gif",
    "M_017": Constants.POCKET_DOMAIN + "/image/etc/17.gif",
    "M_018": Constants.POCKET_DOMAIN + "/image/etc/18.gif",
    "M_019": Constants.POCKET_DOMAIN + "/image/etc/19.gif",
    "M_020": Constants.POCKET_DOMAIN + "/image/etc/20.gif",
    "M_021": Constants.POCKET_DOMAIN + "/image/etc/21.gif",
    "M_022": Constants.POCKET_DOMAIN + "/image/etc/22.gif",
    "M_023": Constants.POCKET_DOMAIN + "/image/etc/23.gif",

    "F_026": Constants.POCKET_DOMAIN + "/image/etc/26.gif",
    "F_027": Constants.POCKET_DOMAIN + "/image/etc/27.gif",
    "F_028": Constants.POCKET_DOMAIN + "/image/etc/28.gif",
    "F_030": Constants.POCKET_DOMAIN + "/image/etc/30.gif",
    "F_031": Constants.POCKET_DOMAIN + "/image/etc/31.gif",
    "F_032": Constants.POCKET_DOMAIN + "/image/etc/32.gif",
    "F_037": Constants.POCKET_DOMAIN + "/image/etc/37.gif",
    "F_039": Constants.POCKET_DOMAIN + "/image/etc/39.gif",
    "F_040": Constants.POCKET_DOMAIN + "/image/etc/40.gif",

    "U_041": Constants.POCKET_DOMAIN + "/image/etc/41.gif",

    "夜三": Constants.POCKET_DOMAIN + "/image/head/1117.gif",
    "花子": Constants.POCKET_DOMAIN + "/image/head/1126.gif",
    "骨头": Constants.POCKET_DOMAIN + "/image/head/1160.gif",
    "狐狸": Constants.POCKET_DOMAIN + "/image/head/1196.gif",
    "七七": Constants.POCKET_DOMAIN + "/image/head/1368.gif",
    "豚豚": Constants.POCKET_DOMAIN + "/image/head/1389.gif",
    "夜九": Constants.POCKET_DOMAIN + "/image/head/1561.gif",
    "剑心": Constants.POCKET_DOMAIN + "/image/head/2184.gif",
    "飘雪": Constants.POCKET_DOMAIN + "/image/head/2196.gif",
    "路路": Constants.POCKET_DOMAIN + "/image/head/2201.gif",
    "饭饭": Constants.POCKET_DOMAIN + "/image/head/3139.gif",
    "亲戚": Constants.POCKET_DOMAIN + "/image/head/3188.gif",
    "马可": Constants.POCKET_DOMAIN + "/image/head/6169.gif",
    "青鸟": Constants.POCKET_DOMAIN + "/image/head/7184.gif",
    "小明": Constants.POCKET_DOMAIN + "/image/head/8166.gif",
    "末末": Constants.POCKET_DOMAIN + "/image/head/8173.gif",
    "白皇": Constants.POCKET_DOMAIN + "/image/head/11134.gif",
    "莫莫": Constants.POCKET_DOMAIN + "/image/head/13165.gif",
    "天翔": Constants.POCKET_DOMAIN + "/image/head/14129.gif",

};

export = NpcLoader;