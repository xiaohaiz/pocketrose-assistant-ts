import _ from "lodash";

class DayRange {

    readonly start: number;
    readonly end: number;

    constructor(time?: number) {
        let timeForUse;
        if (time) {
            timeForUse = time;
        } else {
            timeForUse = Date.now();
        }

        const startInstant = new Date(timeForUse);
        startInstant.setHours(0, 0, 0, 0);
        this.start = startInstant.getTime();

        this.end = this.start + 86400000 - 1;
    }

    asText() {
        const instant = new Date(this.start);
        let year = instant.getFullYear();
        let month = instant.getMonth() + 1;
        let day = instant.getDate();
        return year + _.padStart(month.toString(), 2, "0") + _.padStart(day.toString(), 2, "0");
    }

    toString() {
        return "[" + new Date(this.start).toLocaleString() + "] - [" + new Date(this.end).toLocaleString() + "]";
    }

    previous() {
        return new DayRange(this.start - 1);
    }

    next() {
        return new DayRange(this.end + 1);
    }

    static current() {
        return new DayRange();
    }
}

export = DayRange;