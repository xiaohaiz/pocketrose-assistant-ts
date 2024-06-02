import _ from "lodash";
import StorageUtils from "../util/StorageUtils";

/**
 * ----------------------------------------------------------------------------
 * 基于LocalStorage的设置管理。
 * ----------------------------------------------------------------------------
 * _ts_001       : 是否包含编外人员
 * _ts_002_${id} : 是否提醒武器满级
 * _ts_003_${id} : 是否提醒防具满级
 * _ts_004_${id} : 是否提醒饰品满级
 * _ts_005_${id} : 身上装备位是否已满
 * _ts_006_${id} : 身上宠物位是否已满
 * _ts_007_${id} : 触发装备宠物统计数据更新的标识
 * _ts_008_${id} : 齐心丹任务和匹诺曹战斗后失败是否自动吃药
 * _ts_009_${id} : 齐心丹任务保留
 * ----------------------------------------------------------------------------
 */
class LocalSettingManager {

    static isRecognizedKey(key: string) {
        return _.startsWith(key, "_ts_");
    }

    // ------------------------------------------------------------------------

    static isIncludeExternal(): boolean {
        return StorageUtils.getBoolean("_ts_001");
    }

    static setIncludeExternal(value: boolean) {
        StorageUtils.set("_ts_001", Number(value).toString());
    }

    // ------------------------------------------------------------------------

    static isWeaponExperienceMax(id: string) {
        return StorageUtils.getBoolean("_ts_002_" + id);
    }

    static setWeaponExperienceMax(id: string, value: boolean) {
        StorageUtils.set("_ts_002_" + id, Number(value).toString());
    }

    // ------------------------------------------------------------------------

    static isArmorExperienceMax(id: string) {
        return StorageUtils.getBoolean("_ts_003_" + id);
    }

    static setArmorExperienceMax(id: string, value: boolean) {
        StorageUtils.set("_ts_003_" + id, Number(value).toString());
    }

    // ------------------------------------------------------------------------

    static isAccessoryExperienceMax(id: string) {
        return StorageUtils.getBoolean("_ts_004_" + id);
    }

    static setAccessoryExperienceMax(id: string, value: boolean) {
        StorageUtils.set("_ts_004_" + id, Number(value).toString());
    }

    // ------------------------------------------------------------------------

    static isEquipmentCapacityMax(id: string) {
        return StorageUtils.getBoolean("_ts_005_" + id);
    }

    static setEquipmentCapacityMax(id: string, value: boolean) {
        StorageUtils.set("_ts_005_" + id, Number(value).toString());
    }

    // ------------------------------------------------------------------------

    static isPetCapacityMax(id: string) {
        return StorageUtils.getBoolean("_ts_006_" + id);
    }

    static setPetCapacityMax(id: string, value: boolean) {
        StorageUtils.set("_ts_006_" + id, Number(value).toString());
    }

    // ------------------------------------------------------------------------

    static hasStatisticsTriggered(id: string) {
        return StorageUtils.getBoolean("_ts_007_" + id);
    }

    static setStatisticsTriggered(id: string) {
        StorageUtils.set("_ts_007_" + id, "1");
    }

    static unsetStatisticsTriggered(id: string) {
        StorageUtils.remove("_ts_007_" + id);
    }

    static drainStatisticsTriggered(id: string) {
        const value = LocalSettingManager.hasStatisticsTriggered(id);
        LocalSettingManager.unsetStatisticsTriggered(id);
        return value;
    }

}

export = LocalSettingManager;