import StringUtils from "../util/StringUtils";
import Constants from "../util/Constants";

class NpcLoader {

    static getNpcImageHtml(name: string) {
        // @ts-ignore
        const image = POCKET_NPC_IMAGES[name];
        if (image === undefined) {
            return null;
        }
        let s = StringUtils.substringAfterLast(image, "/");
        s = StringUtils.substringBefore(s, ".gif");
        return "<img src='" + image + "' width='64' height='64' alt='" + name + "' id='p_" + s + "'>";
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
    "武器屋老板娘": Constants.POCKET_DOMAIN + "/image/etc/27.gif",
    "客栈老板娘": Constants.POCKET_DOMAIN + "/image/etc/30.gif",

    "夜三": Constants.POCKET_DOMAIN + "/image/head/1117.gif",
    "花子": Constants.POCKET_DOMAIN + "/image/head/1126.gif",
    "骨头": Constants.POCKET_DOMAIN + "/image/head/1160.gif",
    "七七": Constants.POCKET_DOMAIN + "/image/head/1368.gif",
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