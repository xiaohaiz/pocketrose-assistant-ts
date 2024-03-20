import StorageUtils from "../../util/StorageUtils";

/**
 * 基于LocalStorage的设置管理。
 */
class LocalSettingManager {

    static isIncludeExternal(): boolean {
        return StorageUtils.getBoolean("_ts_001");
    }

    static setIncludeExternal(value: boolean) {
        StorageUtils.set("_ts_001", Number(value).toString());
    }

}

export = LocalSettingManager;