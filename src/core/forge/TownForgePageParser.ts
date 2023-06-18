import _ from "lodash";
import StringUtils from "../../util/StringUtils";
import Role from "../role/Role";
import TownForgePage from "./TownForgePage";

class TownForgePageParser {

    static async parse(html: string): Promise<TownForgePage> {
        const page = new TownForgePage(new Role());

        let table = $(html).find("table:first");
        $(table).find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:last")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .each((idx, td) => {
                page.role.name = $(td).text();
            })
            .next()
            .each((idx, td) => {
                let s = $(td).text();
                page.role.level = _.parseInt(s);
            })
            .next()
            .each((idx, td) => {
                let s = $(td).text();
                s = StringUtils.substringBefore(s, "属");
                page.role.attribute = s;
            })
            .next()
            .each((idx, td) => {
                page.role.career = $(td).text();
            })
            .parent()
            .next()
            .find("> td:last")
            .each((idx, td) => {
                let s = $(td).text();
                s = StringUtils.substringBefore(s, " GOLD");
                page.role.cash = _.parseInt(s);
            });

        return page;
    }
}

export = TownForgePageParser;