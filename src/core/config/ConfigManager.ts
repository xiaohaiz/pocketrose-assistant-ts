import _ from "lodash";
import Constants from "../../util/Constants";
import LocalSettingManager from "./LocalSettingManager";
import StorageUtils from "../../util/StorageUtils";
import Credential from "../../util/Credential";

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
    const ss: string[] = [];
    for (let i = 0; i < Constants.MAX_TEAM_MEMBER_COUNT; i++) {
        ss.push("_fl_" + i);
    }
    if (_.includes(ss, key)) return true;
    return _.startsWith(key, "_pa_");
}

class BattleConfigManager {

    private readonly roleId: string;

    constructor(value: Credential | string) {
        if (value instanceof Credential) {
            this.roleId = value.id;
        } else {
            this.roleId = value as string;
        }
    }

    static isSafeBattleButtonEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_045");
    }

    static enableSafeBattleButton() {
        StorageUtils.set("_pa_045", "1");
    }

    static disableSafeBattleButton() {
        StorageUtils.set("_pa_045", "0");
    }

    // ------------------------------------------------------------------------

    static isHiddenBattleButtonEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_046");
    }

    static enableHiddenBattleButton() {
        StorageUtils.set("_pa_046", "1");
    }

    static disableHiddenBattleButton() {
        StorageUtils.set("_pa_046", "0");
    }

    // ------------------------------------------------------------------------

    get isAutoSetBattleFieldEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_059_" + this.roleId);
    }

    enableAutoSetBattleField() {
        StorageUtils.set("_pa_059_" + this.roleId, "1");
    }

    disableAutoSetBattleField() {
        StorageUtils.set("_pa_059_" + this.roleId, "0");
    }

    // ------------------------------------------------------------------------

    static loadGlobalBattleFieldConfig(): BattleFieldConfig {
        const config = new BattleFieldConfig();
        const s = StorageUtils.getString("_pa_056");
        if (s === "") return config;
        const value = JSON.parse(s);
        (value.primary !== undefined) && (config.primary = value.primary);
        (value.junior !== undefined) && (config.junior = value.junior);
        (value.senior !== undefined) && (config.senior = value.senior);
        (value.zodiac !== undefined) && (config.zodiac = value.zodiac);
        return config;
    }

    loadPersonalBattleFieldConfig(): BattleFieldConfig {
        const config = new BattleFieldConfig();
        const s = StorageUtils.getString("_pa_012_" + this.roleId);
        if (s === "") return config;
        const value = JSON.parse(s);
        (value.primary !== undefined) && (config.primary = value.primary);
        (value.junior !== undefined) && (config.junior = value.junior);
        (value.senior !== undefined) && (config.senior = value.senior);
        (value.zodiac !== undefined) && (config.zodiac = value.zodiac);
        return config;
    }

    loadBattleFieldConfig(): BattleFieldConfig {
        const config = BattleConfigManager.loadGlobalBattleFieldConfig();
        if (config.configured) return config;
        return this.loadPersonalBattleFieldConfig();
    }

    setPersonalBattleFieldConfig(primary: boolean,
                                 junior: boolean,
                                 senior: boolean,
                                 zodiac: boolean) {
        const config = new BattleFieldConfig();
        config.primary = primary;
        config.junior = junior;
        config.senior = senior;
        config.zodiac = zodiac;
        const document = config.asDocument();
        StorageUtils.set("_pa_012_" + this.roleId, JSON.stringify(document));
    }
}

class UIConfigManager {

    private readonly roleId: string;

    constructor(value: Credential | string) {
        if (value instanceof Credential) {
            this.roleId = value.id;
        } else {
            this.roleId = value as string;
        }
    }

}

class MiscConfigManager {

    private readonly roleId: string;

    constructor(value: Credential | string) {
        if (value instanceof Credential) {
            this.roleId = value.id;
        } else {
            this.roleId = value as string;
        }
    }

    get isCollectTownTaxDisabled(): boolean {
        return StorageUtils.getBoolean("_pa_030_" + this.roleId);
    }

    enableCollectTownTax() {
        StorageUtils.set("_pa_030_" + this.roleId, "0");
    }

    disableCollectTownTax() {
        StorageUtils.set("_pa_030_" + this.roleId, "1");
    }
}

class BattleFieldConfig {

    primary = false;
    junior = false;
    senior = false;
    zodiac = false;

    get configured() {
        return this.primary || this.junior || this.senior || this.zodiac;
    }

    get count() {
        let count = 0;
        this.primary && count++;
        this.junior && count++;
        this.senior && count++;
        this.zodiac && count++;
        return count;
    }

    asDocument() {
        const document: any = {};
        (this.primary !== undefined) && (document.primary = this.primary);
        (this.junior !== undefined) && (document.junior = this.junior);
        (this.senior !== undefined) && (document.senior = this.senior);
        (this.zodiac !== undefined) && (document.zodiac = this.zodiac);
        return document;
    }
}

export {ConfigManager, BattleConfigManager, UIConfigManager, MiscConfigManager, BattleFieldConfig};