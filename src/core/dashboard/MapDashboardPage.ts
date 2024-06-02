import _ from "lodash";
import StringUtils from "../../util/StringUtils";
import Role from "../role/Role";
import Coordinate from "../../util/Coordinate";

class MapDashboardPage {

    /**
     * Role parsed from map dashboard page.
     * - name
     * - health
     * - mana
     * - cash
     * - experience
     * - contribution
     */
    role?: Role;

    /**
     * Current location.
     */
    coordinate?: Coordinate;

    moveScope?: number;

    moveMode?: string;

    /**
     * The value undefined means timeout exhausted, action available.
     */
    timeoutInSeconds?: number;

}

class MapDashboardPageParser {

    static parse(pageHTML: string) {
        const page = new MapDashboardPage();
        page.role = new Role();

        const dom = $(pageHTML);
        const roleInformationTable = dom.find("td:contains('ＨＰ')")
            .filter((idx, td) => $(td).text() === "ＨＰ")
            .closest("table");

        const mainTable = roleInformationTable.closest("tr").closest("table");

        roleInformationTable.find("> tbody:first")
            .find("> tr:first > th:first")
            .each((idx, th) => {
                let s = $(th).text();
                page.role!.name = StringUtils.substringBefore(s, "(");
            })
            .closest("tr")
            .closest("tbody")
            .find("> tr:eq(1)")
            .find("> th:first")
            .each((idx, th) => {
                let s = $(th).text();
                page.role!.parseHealth(s);
            })
            .closest("tr")
            .find("> th:eq(1)")
            .each((idx, th) => {
                let s = $(th).text();
                page.role!.parseMana(s);
            })
            .closest("tr")
            .closest("tbody")
            .find("> tr:eq(2)")
            .find("th:first")
            .each((idx, th) => {
                let s = $(th).text();
                s = StringUtils.substringBefore(s, " Gold");
                page.role!.cash = _.parseInt(s);
            })
            .closest("tr")
            .find("> th:eq(1)")
            .each((_idx, th) => {
                let s = $(th).text();
                s = StringUtils.substringBefore(s, " EX");
                page.role!.experience = _.parseInt(s);
            })
            .closest("tr")
            .closest("tbody")
            .find("> tr:eq(3)")
            .find("> th:eq(1)")
            .each((_idx, th) => {
                let s = $(th).text();
                s = StringUtils.substringBefore(s, " p");
                page.role!.contribution = _.parseInt(s);
            });

        const movementTable = mainTable.find("> tbody:first")
            .find("> tr:eq(4)")
            .find("> td:eq(1)")
            .find("> table:first");

        movementTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .each((_idx, td) => {
                let s = $(td).text();
                s = StringUtils.substringBetween(s, "现在位置(", ")");
                page.coordinate = Coordinate.parse(s);
            });

        const maxMoveStep = movementTable
            .find("select[name='chara_m']")
            .find("> option:last")
            .val() as string;
        page.moveScope = _.parseInt(maxMoveStep);

        page.moveMode = "ROOK";
        const nwButton = movementTable.find("input:submit[value='↖']");
        if (!nwButton.prop("disabled")) page.moveMode = "QUEEN";

        const clock = movementTable.find("input:text[name='clock']");
        if (clock.length > 0) {
            let timeout = _.parseInt(clock.val() as string);
            timeout = _.max([timeout, 0])!;
            if (timeout > 0) {
                page.timeoutInSeconds = timeout;
            }
        }

        return page;
    }


}

export {MapDashboardPage, MapDashboardPageParser};