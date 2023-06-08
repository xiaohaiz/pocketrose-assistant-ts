import _ from "lodash";
import StringUtils from "../../util/StringUtils";

class MonsterUtils {

    static asCode(code: number): string {
        return _.padStart(code.toString(), 3, "0");
    }

    static extractCode(name: string): string | null {
        if (!name.includes("(") || !name.includes(")")) {
            return null;
        }
        return StringUtils.substringBetween(name, "(", ")");
    }

}

export = MonsterUtils;