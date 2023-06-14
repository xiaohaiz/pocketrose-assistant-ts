import StorageUtils from "../../util/StorageUtils";

class FastLoginLoader {

    static loadFastLoginConfig(code: number): {} {
        if (code < 0 || code > 49) {
            return {};
        }
        const key = "_fl_" + code;
        const s = StorageUtils.getString(key);
        if (s === "") {
            return {};
        } else {
            return JSON.parse(s);
        }
    }

}

export = FastLoginLoader;