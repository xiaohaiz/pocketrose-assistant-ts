import {VipInformation, VipInformationPage} from "./VipInformationPage";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";

class VipInformationPageParser {

    static parse(pageHTML: string) {
        const dom = $(pageHTML);
        const table = dom.find("font:contains('全VIP画像一览')")
            .filter((_idx, e) => {
                return $(e).text() === "全VIP画像一览";
            })
            .closest("div")
            .find("> table:first");

        const informationList: VipInformation[] = [];
        table.find("img")
            .each((_idx, e) => {
                const information = new VipInformation();
                const img = $(e);
                let s = img.attr("src") as string;
                information.image = StringUtils.substringAfterLast(s, "/");

                const td = img.closest("td");
                s = td.text();

                let t = StringUtils.substringAfterLast(s, "(");
                t = "(" + t;
                information.race = StringUtils.substringBefore(s, t);
                information.code = _.parseInt(StringUtils.substringBetween(t, "(", ")"));

                informationList.push(information);
            });

        const page = new VipInformationPage();
        page.informationList = informationList.sort((a, b) => {
            return a.code! - b.code!;
        });
        return page;
    }

}

export = VipInformationPageParser;