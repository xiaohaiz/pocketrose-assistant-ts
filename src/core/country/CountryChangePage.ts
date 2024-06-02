import _ from "lodash";

class CountryChangePage {

    pHTML?: string;
    centerHTML?: string;

}

class CountryChangePageParser {

    static parse(pageHTML: string) {
        const dom = $(pageHTML);
        const td = dom.find("th:contains('各国招募动员令')")
            .filter((_idx, e) => {
                const t = $(e).text();
                return t === "各国招募动员令";
            })
            .closest("table")
            .css("margin", "auto")
            .closest("p")
            .closest("td");

        // 在野不需要招募动员，删除掉
        td.find("> p:first > table:first > tbody:first")
            .find("> tr")
            .filter((_idx, e) => {
                const t = $(e).find("> td:first").text();
                return t === "在野";
            })
            .remove();

        const table = td.find("> center:first > form:first > table:first");
        table.find("> tbody:first")
            .find("> tr")
            .filter(idx => idx > 0)
            .each((_idx, tr) => {
                const node = $(tr).find("> td:eq(2)");
                const m = _.parseInt(node.text());
                node.text(m.toLocaleString() + " GOLD");
                node.css("text-align", "right");
            });

        const page = new CountryChangePage();
        page.pHTML = td.find("> p:first").html();
        page.centerHTML = td.find("> center:first").html();
        return page;
    }
}

export {CountryChangePage, CountryChangePageParser};