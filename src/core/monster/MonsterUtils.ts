import _ from "lodash";
import StringUtils from "../../util/StringUtils";

class MonsterUtils {

    static asCode(code: number | null | undefined): string | null {
        if (!code) return null;
        return _.padStart(code.toString(), 3, "0");
    }

    static extractCode(name: string | null | undefined): string | null {
        if (!name) return null;
        if (!name.includes("(") || !name.includes(")")) return null;
        return StringUtils.substringBetween(name, "(", ")");
    }

}

export = MonsterUtils;