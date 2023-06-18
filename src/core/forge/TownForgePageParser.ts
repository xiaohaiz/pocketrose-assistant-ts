import _ from "lodash";
import StringUtils from "../../util/StringUtils";
import Equipment from "../equipment/Equipment";
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

        $(html).find("input:radio")
            .each((idx, radio) => {
                const c1 = $(radio).parent();
                const c2 = c1.next();
                const c3 = c2.next();
                const c4 = c3.next();
                const c5 = c4.next();
                const c6 = c5.next();
                const c7 = c6.next();
                const c8 = c7.next();

                const equipment = new Equipment();
                equipment.index = _.parseInt($(radio).val() as string);
                equipment.selectable = !$(radio).prop("disabled");
                equipment.using = c2.text() === "★";
                equipment.parseName(c3.html());
                equipment.category = c4.text();
                equipment.power = _.parseInt(c5.text());
                equipment.weight = _.parseInt(c6.text());
                equipment.parseEndure(c7.text());
                equipment.repairPrice = _.parseInt(StringUtils.substringBefore(c8.text(), " Gold"));
                page.equipmentList.push(equipment);
            });

        return page;
    }
}

export = TownForgePageParser;