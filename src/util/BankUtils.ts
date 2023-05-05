class BankUtils {

    static calculateCashDifferenceAmount(cash: number, expect: number) {
        if (cash >= expect) {
            return 0;
        }
        return Math.ceil((expect - cash) / 10000);
    }

}

export = BankUtils;