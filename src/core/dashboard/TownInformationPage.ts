import TownStatus from "../town/TownStatus";
import StringUtils from "../../util/StringUtils";

class TownInformationPage {

    statusList?: TownStatus[];
    groupByCountries?: Map<string, TownStatus[]>;

    initialize() {
        if (!this.statusList) {
            return;
        }
        this.groupByCountries = new Map<string, TownStatus[]>();
        for (const town of this.statusList!) {
            const c = town.country!
            if (!this.groupByCountries.has(c)) {
                this.groupByCountries.set(c, []);
            }
            this.groupByCountries.get(c)!.push(town);
        }
    }

    findByName(name: string | undefined | null): TownStatus | null {
        if (!name) {
            return null;
        }
        if (!this.statusList) {
            return null;
        }
        for (const town of this.statusList) {
            if (town.name === name) {
                return town;
            }
        }
        return null;
    }

    get countries(): string[] {
        if (!this.groupByCountries) {
            return [];
        }
        const cs: string[] = [];
        for (const c of this.groupByCountries.keys()) {
            cs.push(c);
        }
        return cs.sort();
    }

    getTownList(c: string): TownStatus[] {
        if (!this.groupByCountries) {
            return [];
        }
        const ck = c === "在野" ? "" : c;
        if (!this.groupByCountries.has(ck)) {
            return [];
        }
        return this.groupByCountries.get(ck)!
            .sort((a, b) => {
                if (a.capital) return -1;
                if (b.capital) return 1;
                return a.name!.localeCompare(b.name!);
            });
    }
}

class TownInformationPageParser {

    static parse(html: string): TownInformationPage {
        const statusList: TownStatus[] = [];
        $(html).find("tr")
            .filter(function (_idx) {
                return _idx > 0;
            })
            .each(function (_idx, tr) {
                const c0 = $(tr).find("td:first");
                const c1 = c0.next();
                const c2 = c1.next();
                const c3 = c2.next();

                const status = new TownStatus();
                let s = c0.text();
                if (s !== undefined && s.trim() !== "") {
                    // 神奇啊，城市被多弄出来了？不知道怎么回事，先过滤吧

                    if (s.endsWith(" 首都")) {
                        status.name = StringUtils.substringBefore(s, " 首都");
                        status.capital = true;
                    } else {
                        status.name = s;
                        status.capital = false;
                    }
                    status.color = c0.find("font:first").attr("color");
                    status.bgcolor = c0.attr("bgcolor");
                    status.country = c1.text();
                    s = c2.text();
                    status.tax = parseInt(StringUtils.substringBefore(s, " GOLD"));
                    status.attribute = c3.text();

                    statusList.push(status);
                }
            });

        const page = new TownInformationPage();
        page.statusList = statusList;
        page.initialize();
        return page;
    }

}

export {TownInformationPage, TownInformationPageParser};