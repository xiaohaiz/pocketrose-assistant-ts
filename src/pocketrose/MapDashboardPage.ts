import _ from "lodash";
import Role from "../common/Role";
import StringUtils from "../util/StringUtils";

class MapDashboardPage {

    role?: Role;

    static parse(html: string) {
        const role = new Role();
        $(html)
            .find("td:contains('ＨＰ')")
            .filter((idx, td) => $(td).text() === "ＨＰ")
            .closest("table")
            .find("tr:first")
            .find("th:first")
            .each((idx, th) => {
                let s = $(th).text();
                role.name = StringUtils.substringBefore(s, "(");
            })
            .parent()
            .next()
            .find("td:first")
            .next()
            .each((idx, th) => {
                let s = $(th).text();
                role.parseHealth(s);
            })
            .next()
            .next()
            .each((idx, th) => {
                let s = $(th).text();
                role.parseMana(s);
            })
            .parent()
            .next()
            .find("td:first")
            .next()
            .each((idx, th) => {
                let s = $(th).text();
                s = StringUtils.substringBefore(s, " Gold");
                role.cash = _.parseInt(s);
            });
        const page = new MapDashboardPage();
        page.role = role;
        return page;
    }

}

export = MapDashboardPage;