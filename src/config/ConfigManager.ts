import _ from "lodash";

class ConfigManager {

    /**
     * 导出助手配置信息，包括快速登陆的配置。
     */
    static exportAsJson() {
        const s = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === null) {
                continue;
            }
            if (_.startsWith(key, "_pa_") || _.startsWith(key, "_fl_")) {
                // 只导出配置信息
                const value = localStorage.getItem(key);
                if (value === null) {
                    continue;
                }
                // @ts-ignore
                s[key] = value;
            }
        }
        return JSON.stringify(s);
    }
}

export = ConfigManager;