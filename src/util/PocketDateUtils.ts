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

export {DayRange, WeekRange, MonthRange};