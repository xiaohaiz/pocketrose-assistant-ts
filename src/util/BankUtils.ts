class BankUtils {

    static checkAmountAvailability(amount: number) {
        if (isNaN(amount)) {
            return false;
        }
        if (!Number.isInteger(amount)) {
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

export = BankUtils;