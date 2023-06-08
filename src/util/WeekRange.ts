import _ from "lodash";

class WeekRange {

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
        let t = startInstant.getTime();
        let w = startInstant.getDay();
        this.start = t - (w * 86400000);
        this.end = this.start + (86400000 * 7) - 1;
    }

    asText() {
        let date = new Date(this.start);
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        let week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        let weekNo = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
            - 3 + (week1.getDay() + 6) % 7) / 7);

        date = new Date(this.start);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        let weekYear = date.getFullYear();

        return weekYear + _.padStart(weekNo.toString(), 2, "0");
    }

    toString() {
        return "[" + new Date(this.start).toLocaleString() + "] - [" + new Date(this.end).toLocaleString() + "]";
    }

    previous() {
        return new WeekRange(this.start - 1);
    }

    next() {
        return new WeekRange(this.end + 1);
    }

    static current() {
        return new WeekRange();
    }
}

export = WeekRange;