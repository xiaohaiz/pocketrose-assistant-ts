import _ from "lodash";
import Constants from "../../util/Constants";
import LocalSettingManager from "./LocalSettingManager";
import SetupItemManager from "./SetupItemManager";

class ConfigManager {

    static exportAsJson() {
        const s = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === null) {
                continue;
            }
            if (isRecognizedKey(key)) {
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

    static importFromJson(json: string) {
        const allConfigs = JSON.parse(json);
        const keys = Object.keys(allConfigs);
        for (const key of keys) {
            // @ts-ignore
            const value = allConfigs[key];
            localStorage.setItem(key, value);
        }
    }

    static purge() {
        localStorage.clear();
    }
}

/**
 * _st_
 * _ts_
 * _fl_
 * _pa_
 */
function isRecognizedKey(key: string) {
    if (_.startsWith(key, "_st_")) {
        return true;
    }
    if (LocalSettingManager.isRecognizedKey(key)) {
        return true;
    }
    let ss: string[] = [];
    for (let i = 0; i < Constants.MAX_TEAM_MEMBER_COUNT; i++) {
        ss.push("_fl_" + i);
    }
    if (_.includes(ss, key)) return true;
    ss = SetupItemManager.getInstance().getSetupItem()
        .map(it => it.code())
        .map(it => "_pa_" + it);
    for (const s of ss) {
        if (s === key || _.startsWith(key, s)) {
            return true;
        }
    }
    return false;
}

export = ConfigManager;