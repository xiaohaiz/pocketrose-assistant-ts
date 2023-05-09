import Equipment from "../common/Equipment";
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

    const equipmentList: Equipment[] = [];
    $(html).find("input:radio")
        .each(function (_idx, radio) {
            const c0 = $(radio).parent();
            const c1 = c0.next();
            const c2 = c1.next();
            const c3 = c2.next();
            const c4 = c3.next();
            const c5 = c4.next();
            const c6 = c5.next();
            const c7 = c6.next();

            const equipment = new Equipment();
            equipment.index = parseInt($(radio).val() as string);
            equipment.selectable = !$(radio).prop("disabled");
            equipment.using = c1.text() === "★";
            equipment.parseName(c2.html());
            equipment.category = c3.text();
            equipment.additionalPower = parseInt(c4.text());
            equipment.additionalWeight = parseInt(c5.text());
            equipment.additionalLuck = parseInt(c6.text());
            equipment.parseGemCount(c7.text());

            equipmentList.push(equipment);
        });

    const page = new TownGemMeltHousePage();
    page.role = role;
    page.equipmentList = equipmentList;
    return page;
}

export = TownGemMeltHouse;