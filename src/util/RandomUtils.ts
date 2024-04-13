import _ from "lodash";
import ObjectID from "bson-objectid";

class RandomUtils {

    static nextObjectID(): string {
        return ObjectID().toHexString();
    }

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

    static randomElementId(): string {
        return "_pocket_" + RandomUtils.nextObjectID();
    }

    static randomElementClass(): string {
        return "C_pocket_" + RandomUtils.nextObjectID();
    }
}

export = RandomUtils;