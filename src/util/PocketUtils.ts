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

    static checkAmount(amount: number) {
        if (_.isNaN(amount)) {
            return false;
        }
        if (!_.isInteger(amount)) {
            return false;
        }
        return amount >= 0;
    }
}

export = PocketUtils;