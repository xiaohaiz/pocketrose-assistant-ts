import StringUtils from "../util/StringUtils";
import Constants from "../util/Constants";

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

    static getNpcNames(): string[] {
        const names: string[] = [];
        const allNames = Object.keys(POCKET_NPC_IMAGES);
        for (let i = 0; i < allNames.length; i++) {
            const name = allNames[i];
            // @ts-ignore
            const image = POCKET_NPC_IMAGES[name];
            if (image.includes("/image/head/")) {
                names.push(name);
            }
        }
        return names;
    }

}

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
    "七七": Constants.POCKET_DOMAIN + "/image/head/1368.gif",
    "豚豚": Constants.POCKET_DOMAIN + "/image/head/1389.gif",
    "夜九": Constants.POCKET_DOMAIN + "/image/head/1561.gif",
    "路路": Constants.POCKET_DOMAIN + "/image/head/2201.gif",
    "饭饭": Constants.POCKET_DOMAIN + "/image/head/3139.gif",
    "亲戚": Constants.POCKET_DOMAIN + "/image/head/3188.gif",
    "莫莫": Constants.POCKET_DOMAIN + "/image/head/4200.gif",
    "青鸟": Constants.POCKET_DOMAIN + "/image/head/7184.gif",
    "末末": Constants.POCKET_DOMAIN + "/image/head/8173.gif",
    "白皇": Constants.POCKET_DOMAIN + "/image/head/11134.gif"
};

export = NpcLoader;