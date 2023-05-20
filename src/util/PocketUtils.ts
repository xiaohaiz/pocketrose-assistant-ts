/**
 * 口袋相关的一些杂七杂八的工具函数集合。
 */
import _ from "lodash";

class PocketUtils {

    static asPetCode(code: number): string {
        let s = code.toString();
        return _.padStart(s, 3, "0");
    }

    static asRequest(map: Map<string, string>) {
        const result = {};
        map.forEach(function (value, key) {
            // @ts-ignore
            result[key] = value;
        });
        return result;
    }

}

export = PocketUtils;