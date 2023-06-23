import Credential from "../../util/Credential";
import StorageUtils from "../../util/StorageUtils";

class BattleFieldConfigLoader {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    loadConfig(): {} {
        let config = BattleFieldConfigLoader.loadGlobalConfig();
        if (isConfigured(config)) {
            return config;
        }
        return BattleFieldConfigLoader.loadCustomizedConfig(this.#credential.id);
    }

    static loadGlobalConfig(): {} {
        let value;
        const s = StorageUtils.getString("_pa_056");
        if (s === "") {
            value = {};
            // @ts-ignore
            value["primary"] = false;
            // @ts-ignore
            value["junior"] = false;
            // @ts-ignore
            value["senior"] = false;
            // @ts-ignore
            value["zodiac"] = false;
        } else {
            value = JSON.parse(s);
        }
        return value;
    }

    static loadCustomizedConfig(id: string): {} {
        let value;
        const s = StorageUtils.getString("_pa_012_" + id);
        if (s === "") {
            value = {};
            // @ts-ignore
            value["primary"] = false;
            // @ts-ignore
            value["junior"] = false;
            // @ts-ignore
            value["senior"] = false;
            // @ts-ignore
            value["zodiac"] = false;
        } else {
            value = JSON.parse(s);
        }
        return value;
    }
}

function isConfigured(config: {}) {
    let count = 0;
    // @ts-ignore
    if (config["primary"]) {
        count++;
    }
    // @ts-ignore
    if (config["junior"]) {
        count++;
    }
    // @ts-ignore
    if (config["senior"]) {
        count++;
    }
    // @ts-ignore
    if (config["zodiac"]) {
        count++;
    }
    return count > 0;
}

export = BattleFieldConfigLoader;