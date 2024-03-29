import NetworkUtils from "../../util/NetworkUtils";
import StringUtils from "../../util/StringUtils";
import TownStatus from "../town/TownStatus";
import TownInformationPage from "./TownInformationPage";

class TownInformation {

    async open(): Promise<TownInformationPage> {
        return await (() => {
            return new Promise<TownInformationPage>(resolve => {
                NetworkUtils.get("town_print.cgi").then(html => {
                    const page = TownInformation.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

    static parsePage(html: string): TownInformationPage {
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
                    // 神奇啊，城市被多弄出来一个？不知道怎么回事，先过滤吧

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

export = TownInformation;