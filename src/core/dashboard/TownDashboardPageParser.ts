import Role from "../../common/Role";
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

        // 解析页面上的内容
        _parseOnlineList(page, t0);

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

export = TownDashboardPageParser;