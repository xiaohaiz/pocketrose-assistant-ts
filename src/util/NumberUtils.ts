class NumberUtils {

    static isIndexNumber(n: number): boolean {
        if (Number.isNaN(n)) {
            return false;
        }
        if (!Number.isInteger(n)) {
            return false;
        }
        return n >= 0;
    }

}

export = NumberUtils;