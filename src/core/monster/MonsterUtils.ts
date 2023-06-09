import _ from "lodash";

class MonsterUtils {

    static asCode(code: number | null | undefined): string | null {
        if (!code) return null;
        return _.padStart(code.toString(), 3, "0");
    }

}

export = MonsterUtils;