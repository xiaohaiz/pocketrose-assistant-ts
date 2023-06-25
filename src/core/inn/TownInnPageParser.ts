import _ from "lodash";
import StringUtils from "../../util/StringUtils";
import Role from "../role/Role";
import TownInnPage from "./TownInnPage";

class TownInnPageParser {

    async parse(html: string): Promise<TownInnPage> {
        const page = new TownInnPage(new Role());
        let table = $("table:first")
            .find("> tbody:first > tr:first > td:first")
            .find("> table:first");
        $(table).find("> tbody > tr:eq(1) > td:first")
            .find("> table:first > tbody:first > tr:first > td:last")
            .find("> table:first > tbody:first > tr:first > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .each((idx, td) => {
                page.role.name = $(td).text();
            })
            .next()
            .each((idx, td) => {
                page.role.level = _.parseInt($(td).text());
            })
            .next()
            .each((idx, td) => {
                let s = $(td).text();
                page.role.attribute = StringUtils.substringBefore(s, "属");
            })
            .next()
            .each((idx, td) => {
                page.role.career = $(td).text();
            })
            .parent().next()
            .find("> td:eq(1)")
            .each((idx, td) => {
                let s = $(td).text();
                s = StringUtils.substringBefore(s, " GOLD");
                page.role.cash = _.parseInt(s);
            });

        const s = $(table).find("> tbody:first > tr:last > td:first")
            .find("> form:first")
            .find("> input:hidden[name='inn_gold']")
            .val() as string;
        page.lodgeExpense = _.parseInt(s);

        return page;
    }
}

export = TownInnPageParser;