/**
 * 口袋相关的一些杂七杂八的工具函数集合。
 */
import _ from "lodash";

class PocketUtils {

    static asPetCode(code: number): string {
        let s = code.toString();
        return _.padStart(s, 3, "0");
    }

}

export = PocketUtils;