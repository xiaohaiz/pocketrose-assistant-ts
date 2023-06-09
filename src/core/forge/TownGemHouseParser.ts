import Credential from "../../util/Credential";
import StringUtils from "../../util/StringUtils";
import Equipment from "../equipment/Equipment";
import Role from "../role/Role";
import TownGemHousePage from "./TownGemHousePage";
import TownGemMeltHouse from "./TownGemMeltHouse";

class TownGemHouseParser {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async parse(html: string): Promise<TownGemHousePage> {
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
        $(html).find("td:contains('选择要合成的装备')")
            .filter(function () {
                return $(this).text().startsWith("选择要合成的装备");
            })
            .find("table:first")
            .find("input:radio")
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
                equipment.power = parseInt(c4.text());
                equipment.weight = parseInt(c5.text());
                equipment.parseEndure(c6.text());
                equipment.parseGemCount(c7.text());

                equipmentList.push(equipment);
            });

        const gemList: Equipment[] = [];
        $(html).find("td:contains('选择要使用的宝石')")
            .filter(function () {
                return $(this).text().startsWith("\n选择要使用的宝石");
            })
            .find("table:first")
            .find("input:radio")
            .each(function (_idx, radio) {
                const c0 = $(radio).parent();
                const c1 = c0.next();

                const gem = new Equipment();
                gem.index = parseInt($(radio).val() as string);
                gem.selectable = true;
                gem.parseName(c1.html());
                gemList.push(gem);
            });

        const page = new TownGemHousePage();
        page.role = role;
        page.equipmentList = equipmentList;
        page.gemList = gemList;
        page.townGemMeltHousePage = await new TownGemMeltHouse(this.#credential, this.#townId).open();
        return page;
    }

}

export = TownGemHouseParser;