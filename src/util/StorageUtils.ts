import _ from "lodash";

class StorageUtils {

    static set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    static get(key: string): string | null {
        return localStorage.getItem(key);
    }

    static remove(key: string) {
        localStorage.removeItem(key);
    }

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

    static getString(key: string) {
        const value = StorageUtils.get(key);
        if (value === undefined ||
            value === null ||
            value === "undefined" ||
            value === "null") {
            return "";
        }
        return value;
    }

    static getBoolean(key: string): boolean {
        const value = StorageUtils.getString(key);
        if (value === "") {
            return false;
        }
        return value !== "0";
    }

    static getInt(key: string, defaultValue: number): number {
        const value = StorageUtils.getString(key);
        if (value === "") {
            return defaultValue;
        }
        return parseInt(value);
    }

    static getFloat(key: string, defaultValue: number): number {
        const value = StorageUtils.getString(key);
        if (value === "") {
            return defaultValue;
        }
        return parseFloat(value);
    }

}

export = StorageUtils;