import TownStatus from "../common/TownStatus";
import StringUtils from "../util/StringUtils";
import TownInformationPage from "./TownInformationPage";

class TownInformation {

    static parsePage(html: string): TownInformationPage {
        const statusList: TownStatus[] = [];
        $(pageHtml).find("tr")
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
                if (s.endsWith(" 首都")) {
                    status.name = StringUtils.substringBefore(s, " 首都");
                } else {
                    status.name = s;
                }
                status.color = c0.find("font:first").attr("color");
                status.country = c1.text();
                s = c2.text();
                status.tax = parseInt(StringUtils.substringBefore(s, " GOLD"));
                status.attribute = c3.text();

                statusList.push(status);
            });

        const page = new TownInformationPage();
        page.statusList = statusList;
        return page;
    }
}

export = TownInformation;