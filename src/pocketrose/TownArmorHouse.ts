import Equipment from "../common/Equipment";
import Role from "../common/Role";
import Credential from "../util/Credential";
import StringUtils from "../util/StringUtils";
import TownArmorHousePage from "./TownArmorHousePage";

class TownArmorHouse {

    readonly #credential: Credential;
    readonly #townId: string;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    static parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }
}

function doParsePage(pageHtml: string) {
    const townId = $(pageHtml).find("input:hidden[name='townid']:first").val() as string;

    let discount = 1;
    const input = $(pageHtml).find("input:hidden[name='val_off']:first");
    if (input.length > 0) {
        discount = parseFloat(input.val() as string);
    }

    const role = new Role();
    $(pageHtml).find("td:contains('姓名')")
        .filter((idx, td) => $(td).text() === "姓名")
        .closest("table")
        .find("tr:first")
        .next()
        .find("td:first")
        .each((idx, td) => {
            role.name = $(td).text();
        })
        .next()
        .each((idx, td) => {
            let s = $(td).text();
            role.level = parseInt(s);
        })
        .next()
        .each((idx, td) => {
            role.attribute = $(td).text();
        })
        .next()
        .each((idx, td) => {
            role.career = $(td).text();
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

    const page = new TownArmorHousePage();
    page.townId = townId;
    page.discount = discount;
    page.role = role;
    page.equipmentList = doParsePersonalEquipmentList(pageHtml);

    return page;
}

function doParsePersonalEquipmentList(pageHtml: string) {
    const personalEquipmentList: Equipment[] = [];

    $(pageHtml)
        .find("input:submit[value='物品卖出']")
        .closest("table")
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
            equipment.parsePrice(c7.html());

            personalEquipmentList.push(equipment);
        });

    return personalEquipmentList;
}

export = TownArmorHouse;