import _ from "lodash";
import StorageUtils from "../util/StorageUtils";

class ConfigManager {

    /**
     * 导出助手配置数据，包括快速登陆的数据。
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

    /**
     * 从JSON导入配置
     * @param json Configs' json
     */
    static importFromJson(json: string) {
        const allConfigs = JSON.parse(json);
        const keys = Object.keys(allConfigs);
        for (const key of keys) {
            // @ts-ignore
            const value = allConfigs[key];
            StorageUtils.set(key, value);
        }
    }

    /**
     * 清理所有的配置数据。
     */
    static purge() {
        const candidates: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === null) {
                continue;
            }
            if (_.startsWith(key, "_pa_") || _.startsWith(key, "_fl_")) {
                // 只清理配置数据
                candidates.push(key);
            }
        }
        for (const candidate of candidates) {
            StorageUtils.remove(candidate);
        }
    }
}

export = ConfigManager;