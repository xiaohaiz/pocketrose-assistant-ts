import _ from "lodash";
import Role from "../core/role/Role";
import Coordinate from "../util/Coordinate";
import StringUtils from "../util/StringUtils";

class MetroDashboardPage {

    role?: Role;
    scope?: number;
    mode?: string;
    coordinate?: Coordinate;

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

        let s = $(html)
            .find("select[name='chara_m']")
            .find("option:last")
            .val();
        const scope = parseInt(s! as string);

        let mode = "ROOK";
        $(html).find("input:submit").each(function (_idx, input) {
            const v = $(input).val();
            const d = $(input).attr("disabled");
            if (v === "↖" && d === undefined) {
                mode = "QUEEN";
            }
        });

        let source = new Coordinate(-1, -1);
        $(html)
            .find("td")
            .each(function (_idx, td) {
                const text = $(td).text();
                if (text.includes("现在位置(") && text.endsWith(")")) {
                    const s = StringUtils.substringBetween(text, "(", ")");
                    const x = StringUtils.substringBefore(s, ",");
                    const y = StringUtils.substringAfter(s, ",");
                    source = new Coordinate(parseInt(x), parseInt(y));
                }
            });

        const page = new MetroDashboardPage();
        page.role = role;
        page.scope = scope;
        page.mode = mode;
        page.coordinate = source;
        return page;
    }

}

export = MetroDashboardPage;