import _ from "lodash";
import Role from "../../common/Role";
import SetupLoader from "../../config/SetupLoader";
import StringUtils from "../../util/StringUtils";
import RankTitleLoader from "../RankTitleLoader";
import TownDashboardPage from "./TownDashboardPage";

class TownDashboardPageParser {

    readonly #html: string;
    readonly #page: TownDashboardPage;

    constructor(html: string) {
        this.#html = html;
        this.#page = this.#doParse();
    }

    parse() {
        return this.#page;
    }

    #doParse() {
        const page = new TownDashboardPage();
        page.role = new Role();

        // 页面主体由上下两个大表格组成
        const t0 = $(this.#html).find("table:first");
        const t1 = t0.next();

        const t0_0 = $(t0)
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first");

        // 解析页面上的内容
        _parseOnlineList(page, t0);
        _parseMobilization(page, t0_0);

        return page;
    }
}

function _parseOnlineList(page: TownDashboardPage, table: JQuery) {
    page.onlineListHtml = $(table)
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .html();
}

function _parseMobilization(page: TownDashboardPage, table: JQuery) {
    $(table)
        .find("> tbody:first")
        .find("> tr:first")
        .find("> td:first")
        .find("> form:first")
        .find("> font:first")
        .each((idx, font) => {
            let c = $(font).text();
            page.mobilizationText = c;
            let b = StringUtils.substringAfterLast(c, "(");
            let a = StringUtils.substringBefore(c, "(" + b);
            b = StringUtils.substringBefore(b, ")");
            const ss = _.split(b, " ");
            const b1 = _.replace(ss[0], "部队", "");
            const b2 = SetupLoader.isQiHanTitleEnabled() ? RankTitleLoader.transformTitle(ss[1]) : ss[1];
            const b3 = ss[2];
            page.processedMobilizationText = a + "(" + b1 + " " + b2 + " " + b3 + ")";
        });
}

export = TownDashboardPageParser;