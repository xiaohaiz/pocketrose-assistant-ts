import Role from "../role/Role";
import TownInnPage from "./TownInnPage";

class TownInnPageParser {

    async parse(html: string): Promise<TownInnPage> {
        const page = new TownInnPage(new Role());
        let table = $("table:first");
        $(table).find("> tbody > tr:eq(1) > td:first")
            .find("> table:first > tbody:first > tr:first > td:last")
            .find("> table:first > tbody:first > tr:first > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .each((idx, td) => {
            })
            .next()
            .each((idx, td) => {
            })
            .next()
            .each((idx, td) => {
            })
            .next()
            .each((idx, td) => {
            })
            .parent().next()
            .find("> td:eq(1)")
            .each((idx, td) => {
            });
        return page;
    }
}

export = TownInnPageParser;