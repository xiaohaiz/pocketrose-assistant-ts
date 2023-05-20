import _ from "lodash";

class RandomUtils {

    static randomElement<T>(list: T[]): T | null {
        if (list.length === 0) {
            return null;
        }
        if (list.length === 1) {
            return list[0];
        }
        const idx = _.random(0, list.length - 1);
        return list[idx];
    }
}

export = RandomUtils;