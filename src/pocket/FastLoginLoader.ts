import StorageUtils from "../util/StorageUtils";

class FastLoginLoader {

    static loadFastLoginConfig(code: number): {} {
        if (code < 0 || code > 9) {
            return {};
        }
        const key = "_fl_" + code;
        const s = StorageUtils.getString("_pa_025");
        if (s === "") {
            return {};
        } else {
            return JSON.parse(s);
        }
    }

}

export = FastLoginLoader;