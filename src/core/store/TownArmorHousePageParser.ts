import StringUtils from "../../util/StringUtils";
import {Equipment} from "../equipment/Equipment";
import Role from "../role/Role";
import Merchandise from "./Merchandise";
import TownArmorHousePage from "./TownArmorHousePage";

class TownArmorHousePageParser {

    async parse(pageHtml: string): Promise<TownArmorHousePage> {
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
        page.merchandiseList = doParseArmorMerchandiseList(pageHtml);

        // Parse space count
        const option = $(pageHtml)
            .find("select[name='num']")
            .find("option:last");
        if (option.length === 0) {
            page.spaceCount = 0;
        } else {
            page.spaceCount = parseInt($(option).val() as string);
        }

        return page;
    }

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

function doParseArmorMerchandiseList(pageHtml: string) {
    const armorMerchandiseList: Merchandise[] = [];

    const table = $(pageHtml).find("input:radio:last")
        .closest("table");
    let specialityMatch = false;
    table.find("tr").each(function (_idx, tr) {
        const c1 = $(tr).find(":first-child");
        const radio = c1.find("input:radio:first");
        if (radio.length > 0) {
            const merchandise = new Merchandise();
            merchandise.id = "ARM_" + $(radio).val();
            merchandise.category = "防具";

            const c2 = c1.next();
            const c3 = c2.next();
            const c4 = c3.next();
            const c5 = c4.next();
            const c6 = c5.next();
            const c7 = c6.next();
            const c8 = c7.next();
            const c9 = c8.next();
            const c10 = c9.next();
            const c11 = c10.next();
            const c12 = c11.next();
            const c13 = c12.next();
            const c14 = c13.next();

            merchandise.name = c2.text();
            merchandise.nameHtml = c2.html();
            let s = c3.text();
            s = StringUtils.substringBefore(s, " Gold");
            merchandise.price = parseInt(s);
            merchandise.power = parseInt(c4.text());
            merchandise.weight = parseInt(c5.text());
            merchandise.endure = parseInt(c6.text());
            merchandise.attribute = c7.text();
            merchandise.requiredCareer = c8.text();
            merchandise.requiredAttack = parseInt(c9.text());
            merchandise.requiredDefense = parseInt(c10.text());
            merchandise.requiredSpecialAttack = parseInt(c11.text());
            merchandise.requiredSpecialDefense = parseInt(c12.text());
            merchandise.requiredSpeed = parseInt(c13.text());
            merchandise.gemCount = parseInt(c14.text());
            merchandise.speciality = specialityMatch;

            armorMerchandiseList.push(merchandise);
        } else if (c1.text() === "== 特产防具 ==") {
            specialityMatch = true;
        }
    });

    return armorMerchandiseList;
}

export = TownArmorHousePageParser;