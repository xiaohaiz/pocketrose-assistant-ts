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
    4: "聊天布局",
    6: "手机布局",
    7: "战斗布局",
};

export = LayoutConfigLoader;