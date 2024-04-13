import _ from "lodash";
import Role from "../role/Role";
import StringUtils from "../../util/StringUtils";
import {TownCastleHousekeeperPage} from "./TownCastleHousekeeperPage";

class TownCastleHousekeeperPageParser {

    static parsePage(html: string): TownCastleHousekeeperPage {
        const page = new TownCastleHousekeeperPage();
        page.role = new Role();

        const tr = $(html).find("table:first")
            .find("> tbody:first > tr:first");

        const src = tr.find("> td:first > img:first")
            .attr("src") as string;
        page.role!.image = StringUtils.substringAfterLast(src, "/");

        const tbody = tr.find("> td:eq(1) > table:first > tbody:first");
        page.role!.name = tbody.find("> tr:eq(1) > td:first").text();
        page.role!.level = _.parseInt(tbody.find("> tr:eq(1) > td:eq(1)").text());
        page.role!.attribute = tbody.find("> tr:eq(1) > td:eq(2)").text();
        page.role!.career = tbody.find("> tr:eq(1) > td:eq(3)").text();

        const s = tbody.find("> tr:eq(2) > td:eq(1)").text();
        page.role!.cash = _.parseInt(StringUtils.substringBefore(s, " GOLD"));

        return page;
    }

}

export {TownCastleHousekeeperPageParser};