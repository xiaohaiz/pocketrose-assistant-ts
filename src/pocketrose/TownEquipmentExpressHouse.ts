import Role from "../common/Role";
import StringUtils from "../util/StringUtils";
import TownEquipmentExpressHousePage from "./TownEquipmentExpressHousePage";

class TownEquipmentExpressHouse {

    static parsePage(html: string): TownEquipmentExpressHousePage {
        const role = new Role();
        $(html).find("td:contains('ＬＶ')")
            .filter((idx, td) => $(td).text() === "ＬＶ")
            .closest("tr")
            .next()
            .find("td:first")
            .each((idx, td) => {
                role.name = $(td).text();
            })
            .next()
            .each((idx, td) => {
                role.level = parseInt($(td).text());
            })
            .next()
            .each((idx, td) => {
                role.attribute = StringUtils.substringBefore($(td).text(), "属");
            })
            .next()
            .each((idx, td) => {
                role.attribute = $(td).text();
            })
            .parent()
            .next()
            .find("td:first")
            .next()
            .each((idx, td) => {
                let s = $(td).text();
                s = StringUtils.substringBefore(s, " GOLD");
                role.cash = parseInt(s);
            })

        const page = new TownEquipmentExpressHousePage();
        page.role = role;
        return page;
    }
}

export = TownEquipmentExpressHouse;