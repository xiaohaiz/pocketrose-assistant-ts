import Credential from "../../util/Credential";
import StorageUtils from "../../util/StorageUtils";
import SetupLoader from "../config/SetupLoader";
import BattleFieldConfig from "./BattleFieldConfig";

class BattleFieldConfigLoader {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    loadConfig(): BattleFieldConfig {
        const config = BattleFieldConfigLoader.loadGlobalConfig();
        if (config.configured) return config;
        return BattleFieldConfigLoader.loadCustomizedConfig(this.#credential.id);
    }

    static loadGlobalConfig(): BattleFieldConfig {
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

    static loadCustomizedConfig(id: string): BattleFieldConfig {
        const config = new BattleFieldConfig();
        const s = StorageUtils.getString("_pa_012_" + id);
        if (s === "") return config;
        const value = JSON.parse(s);
        (value.primary !== undefined) && (config.primary = value.primary);
        (value.junior !== undefined) && (config.junior = value.junior);
        (value.senior !== undefined) && (config.senior = value.senior);
        (value.zodiac !== undefined) && (config.zodiac = value.zodiac);
        return config;
    }

    /**
     * 判断自动设置战斗场所功能是否允许
     */
    static isAutoSetEnabled(): boolean {
        // 1. 必须启用设置：智能选择战斗场
        if (!SetupLoader.isAutoSetBattleFieldEnabled()) {
            return false;
        }
        // 2. 没有设置全局战斗场所
        const config = BattleFieldConfigLoader.loadGlobalConfig();
        return !config.configured;
    }
}

export = BattleFieldConfigLoader;