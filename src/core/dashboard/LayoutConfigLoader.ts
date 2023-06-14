import _ from "lodash";
import LayoutConfig from "./LayoutConfig";

class LayoutConfigLoader {

    static loadAll(): LayoutConfig[] {
        const configList: LayoutConfig[] = [];
        Object.keys(LAYOUTS)
            .map(id => _.parseInt(id))
            .sort((a, b) => a - b)
            .forEach(id => {
                // @ts-ignore
                const name = LAYOUTS[id];
                configList.push(new LayoutConfig(id, name));
            });
        return configList;
    }

}

const LAYOUTS = {
    1: "经典布局",
    2: "手机极简布局Ａ",
    3: "手机极简布局Ｂ",
    4: "聊天布局",
    5: "战斗布局",
    6: "手机版战斗布局",
    7: "战斗布局（增强版）",
};

export = LayoutConfigLoader;