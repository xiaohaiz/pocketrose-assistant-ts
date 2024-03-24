import StorageUtils from "../../util/StorageUtils";
import _ from "lodash";

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

}

export = LocalSettingManager;