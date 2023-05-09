import Role from "../common/Role";
import Credential from "../util/Credential";
import StringUtils from "../util/StringUtils";
import TownGemMeltHousePage from "./TownGemMeltHousePage";

class TownGemMeltHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    static parsePage(html: string): TownGemMeltHousePage {
        return doParsePage(html);
    }
}

function doParsePage(html: string): TownGemMeltHousePage {
    const role = new Role();
    $(html)
        .find("td:contains('姓名')")
        .filter((_idx, td) => $(td).text() === "姓名")
        .closest("table")
        .find("tr:first")
        .next()
        .find("td:first")
        .each((_idx, td) => {
            role.name = $(td).text();
        })
        .next()
        .each((_idx, td) => {
            let s = $(td).text();
            role.level = parseInt(s);
        })
        .next()
        .each((_idx, td) => {
            let s = $(td).text();
            role.attribute = StringUtils.substringBefore(s, "属");
        })
        .next()
        .each((_idx, td) => {
            role.career = $(td).text();
        })
        .parent()
        .next()
        .find("td:first")
        .next()
        .each((_idx, td) => {
            let s = $(td).text();
            s = StringUtils.substringBefore(s, " GOLD");
            role.cash = parseInt(s);
        });

    const page = new TownGemMeltHousePage();
    page.role = role;
    return page;
}

export = TownGemMeltHouse;