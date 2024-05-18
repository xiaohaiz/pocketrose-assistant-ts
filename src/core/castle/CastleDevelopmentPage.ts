import _ from "lodash";
import StringUtils from "../../util/StringUtils";

class CastleDevelopmentPage {

    development?: number;
    maxDevelopment?: number;
    commerce?: number;
    maxCommerce?: number;
    industry?: number;
    maxIndustry?: number;
    mineral?: number;
    maxMineral?: number;
    defense?: number;
    maxDefense?: number;

}

class CastleDevelopmentPageParser {

    static parse(html: string): CastleDevelopmentPage {
        const page = new CastleDevelopmentPage();

        const dom = $(html);
        const form = dom.find("form:first");
        const tableBody = form.find("> table:first > tbody:first");

        let t = tableBody.find("> tr:eq(1) > td:last").text();
        let n = CastleDevelopmentPageParser.parseProgress(t);
        page.development = n[0];
        page.maxDevelopment = n[1];

        t = tableBody.find("> tr:eq(2) > td:last").text();
        n = CastleDevelopmentPageParser.parseProgress(t);
        page.commerce = n[0];
        page.maxCommerce = n[1];

        t = tableBody.find("> tr:eq(3) > td:last").text();
        n = CastleDevelopmentPageParser.parseProgress(t);
        page.industry = n[0];
        page.maxIndustry = n[1];

        t = tableBody.find("> tr:eq(4) > td:last").text();
        n = CastleDevelopmentPageParser.parseProgress(t);
        page.mineral = n[0];
        page.maxMineral = n[1];

        t = tableBody.find("> tr:eq(5) > td:last").text();
        n = CastleDevelopmentPageParser.parseProgress(t);
        page.defense = n[0];
        page.maxDefense = n[1];

        return page;
    }

    private static parseProgress(s: string): number[] {
        let a = 0;
        let b = 0;
        if (_.startsWith(s, "/")) {
            b = _.parseInt(StringUtils.substringAfter(s, "/"));
        } else {
            a = _.parseInt(StringUtils.substringBeforeSlash(s));
            b = _.parseInt(StringUtils.substringAfterSlash(s));
        }
        return [a, b];
    }
}

export {CastleDevelopmentPage, CastleDevelopmentPageParser};
