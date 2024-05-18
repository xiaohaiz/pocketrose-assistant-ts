import StorageUtils from "../util/StorageUtils";

/**
 * 设置项相关的存储功能，与缓存联动。
 */
class SetupStorage {

    static store(key: string, value: string) {
        StorageUtils.set(key, value);
        //bufferInstance.remove(key);
    }

    static storeBoolean(key: string, value: boolean) {
        SetupStorage.store(key, value ? "1" : "0");
    }

    static storeNumber(key: string, value: number) {
        SetupStorage.store(key, value.toString());
    }

    static remove(key: string) {
        StorageUtils.remove(key);
    }

    static read(key: string): string {
        return StorageUtils.getString(key);
    }

    static readBoolean(key: string): boolean {
        return StorageUtils.getBoolean(key);
    }

    static readInt(key: string, defaultValue: number): number {
        return StorageUtils.getInt(key, defaultValue);
    }

    static readFloat(key: string, defaultValue: number): number {
        return StorageUtils.getFloat(key, defaultValue);
    }
}

export {SetupStorage};