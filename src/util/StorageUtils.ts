import _ from "lodash";

const pako = require("pako");
const {encode, decode} = require("uint8-to-base64");

const COMPRESS_THRESHOLD: number = 512;

class StorageUtils {

    static set(key: string, value: string) {
        const plainValueSize = value.length;
        if (plainValueSize <= COMPRESS_THRESHOLD) {
            localStorage.setItem(key, value);
            return;
        }
        const compressed = pako.deflate(value);
        const compressedValue = "DEFLATED:" + encode(compressed);
        const compressedValueSize = compressedValue.length;
        if (compressedValueSize >= plainValueSize) {
            localStorage.setItem(key, value);
            return;
        }
        localStorage.setItem(key, compressedValue);
    }

    static get(key: string): string | null {
        const value = localStorage.getItem(key);
        if (value === null) {
            return null;
        }
        if (_.startsWith(value, "DEFLATED:")) {
            const base64 = value.substring(9);
            const compressed = decode(base64);
            return pako.inflate(compressed, {to: "string"});
        } else {
            return value;
        }
    }

    static remove(key: string) {
        localStorage.removeItem(key);
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