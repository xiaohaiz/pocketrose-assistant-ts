import _ from "lodash";
import StringUtils from "../../util/StringUtils";
import Role from "../role/Role";
import PersonalChampionRole from "./PersonalChampionRole";
import TownPersonalChampionPage from "./TownPersonalChampionPage";

class TownPersonalChampionPageParser {

    async parse(html: string): Promise<TownPersonalChampionPage> {
        return TownPersonalChampionPageParser.parsePage(html);
    }

    static parsePage(html: string): TownPersonalChampionPage {
        const page = new TownPersonalChampionPage();

        // Parse role form page HTML.
        page.role = new Role();
        const roleTable = $(html).find("table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first");
        const image = $(roleTable).find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> img:first")
            .attr("src")!;
        page.role.image = StringUtils.substringAfterLast(image, "/");
        $(roleTable).find("> tbody:first")
            .find("> tr:first")
            .find("> td:eq(3)")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .each((_idx, tr) => {
                page.role!.name = $(tr).find("> td:first").text();
                page.role!.level = _.parseInt($(tr).find("> td:eq(1)").text());
                page.role!.attribute = StringUtils.substringBefore($(tr).find("> td:eq(2)").text(), "属");
                page.role!.career = $(tr).find("> td:eq(3)").text();
            })
            .next()
            .each((_idx, tr) => {
                let s = $(tr).find("> td:eq(1)").text();
                s = StringUtils.substringBefore(s, " GOLD");
                page.role!.cash = _.parseInt(s);
            });

        // Parse candidates.
        page.candidates = [];
        $(html).find("th:contains('比武对手一览')")
            .filter((_idx, th) => {
                const s = $(th).text();
                return _.startsWith(s, "比武对手一览");
            })
            .closest("tbody")
            .find("img")
            .each((_idx, img) => {
                const src = $(img).attr("src")!;
                let s = $(img).parent().html();
                s = StringUtils.substringAfter(s, "<br>");
                const name = StringUtils.substringBefore(s, "(");
                let townName = StringUtils.substringBetween(s, "(", ")");
                if (_.endsWith(townName, " 首都")) {
                    townName = StringUtils.substringBefore(townName, " 首都");
                }
                const pcr = new PersonalChampionRole();
                pcr.image = StringUtils.substringAfterLast(src, "/");
                pcr.name = name;
                pcr.townName = townName;
                page.candidates!.push(pcr);
            });

        // Parse winner
        page.winners = [];
        $(html).find("th:contains('-- 历 代 优 胜 者 --')")
            .filter((_idx, th) => {
                const s = $(th).text();
                return _.startsWith(s, "-- 历 代 优 胜 者 --");
            })
            .closest("tbody")
            .find("img")
            .each((_idx, img) => {
                const src = $(img).attr("src")!;
                let s = $(img).parent().html();
                const name = StringUtils.substringAfter(s, "<br>");
                const pcr = new PersonalChampionRole();
                pcr.image = StringUtils.substringAfterLast(src, "/");
                pcr.name = name;
                page.winners!.push(pcr);
            });

        return page;
    }
}

export = TownPersonalChampionPageParser;