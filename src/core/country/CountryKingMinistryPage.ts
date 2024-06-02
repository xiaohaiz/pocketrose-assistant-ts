import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import Role from "../role/Role";

class CountryKingMinistryPage {

    readonly country: string;
    readonly king: string;
    readonly ministries = new Map<string, string>();
    traditionalHTML?: string;

    constructor(country: string, king: string) {
        this.country = country;
        this.king = king;
    }

    isKing(role?: Role) {
        return (this.country !== "在野") && (role?.name === this.king && role.country === this.country);
    }

}

class CountryKingMinistryPageParser {

    static parse(pageHTML: string) {
        const dom = $(pageHTML);

        if (_.includes(dom.text(), "在野不能实行")) {
            return new CountryKingMinistryPage("在野", "");
        }

        const center = dom.find("input:submit[value='新皇帝决定']")
            .closest("form")
            .closest("center");

        let s = center.text();
        s = StringUtils.substringBefore(s, "现任皇帝 ");
        s = _.trim(s);

        const king = center.find("> font:first > b:first").text();

        const page = new CountryKingMinistryPage(s, king);

        dom.find("td:contains('内阁成员解任或辞任')")
            .filter((_idx, e) => {
                const t = $(e).text();
                return t === "内阁成员解任或辞任";
            })
            .closest("table")
            .find("input:radio")
            .each((_idx, e) => {
                const radio = $(e);
                const roleId = radio.val() as string;
                const roleTitle = radio.closest("tr")
                    .find("> td:eq(2)")
                    .text();
                page.ministries.set(roleId, roleTitle);
            });

        page.traditionalHTML = center.html();

        return page;
    }

}

export {CountryKingMinistryPage, CountryKingMinistryPageParser};