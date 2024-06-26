import _ from "lodash";

class PocketUtils {

    static checkAmount(amount: number) {
        if (_.isNaN(amount)) {
            return false;
        }
        if (!_.isInteger(amount)) {
            return false;
        }
        return amount >= 0;
    }

    static calculateCashDifferenceAmount(cash: number, expect: number) {
        if (cash >= expect) {
            return 0;
        }
        return Math.ceil((expect - cash) / 10000);
    }
}

export = PocketUtils;