import _ from "lodash";

class MonthRange {

    readonly start: number;
    readonly end: number;

    constructor(time?: number) {
        let timeForUse;
        if (time) {
            timeForUse = time;
        } else {
            timeForUse = Date.now();
        }

        // 本月1日00:00:00.000
        const startInstant = new Date(timeForUse);
        startInstant.setHours(0, 0, 0, 0);
        startInstant.setDate(1);
        this.start = startInstant.getTime();

        // 本月最后一日23:59:59.999
        const endInstant = new Date(timeForUse);
        endInstant.setHours(0, 0, 0, 0);
        endInstant.setDate(1);
        let month = endInstant.getMonth();
        month++;
        if (month === 12) {
            endInstant.setFullYear(endInstant.getFullYear() + 1, 0);
        } else {
            endInstant.setMonth(month);
        }
        this.end = endInstant.getTime() - 1;
    }

    asText() {
        const instant = new Date(this.start);
        let year = instant.getFullYear();
        let month = instant.getMonth() + 1;
        return year + _.padStart(month.toString(), 2, "0");
    }

    toString() {
        return "[" + new Date(this.start).toLocaleString() + "] - [" + new Date(this.end).toLocaleString() + "]";
    }

    previous() {
        return new MonthRange(this.start - 1);
    }

    next() {
        return new MonthRange(this.end + 1);
    }

    static current() {
        return new MonthRange();
    }
}

export = MonthRange;