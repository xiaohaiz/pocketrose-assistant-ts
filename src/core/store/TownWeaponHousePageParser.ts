import StringUtils from "../../util/StringUtils";
import {Equipment} from "../equipment/Equipment";
import Merchandise from "./Merchandise";
import TownWeaponHousePage from "./TownWeaponHousePage";

class TownWeaponHousePageParser {

    async parse(pageHtml: string): Promise<TownWeaponHousePage> {
        // Parse townId
        const townId = $(pageHtml).find("input:hidden[name='townid']").val() as string;
        const page = new TownWeaponHousePage(townId);

        // Parse discount
        let discount = 1;
        const input = $(pageHtml).find("input:hidden[name='val_off']");
        if (input.length > 0) {
            discount = parseFloat(input.val() as string);
        }
        page.discount = discount;

        // Parse role cash
        const s = $(pageHtml).find("td:contains('所持金')")
            .filter(function () {
                return $(this).text() === "所持金";
            })
            .next()
            .text();
        page.roleCash = parseInt(StringUtils.substringBefore(s, " GOLD"));

        // Parse space count
        const option = $(pageHtml)
            .find("select[name='num']")
            .find("option:last");
        if (option.length === 0) {
            page.spaceCount = 0;
        } else {
            page.spaceCount = parseInt($(option).val() as string);
        }

        // Parse personal equipment list
        page.personalEquipmentList = doParsePersonalEquipmentList(pageHtml);

        // Parse weapon merchandise list
        page.weaponMerchandiseList = doParseWeaponMerchandiseList(pageHtml);

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

function doParseWeaponMerchandiseList(pageHtml: string) {
    const weaponMerchandiseList: Merchandise[] = [];

    const table = $(pageHtml).find("input:radio:last")
        .closest("table");
    let specialityMatch = false;
    table.find("tr").each(function (_idx, tr) {
        const c1 = $(tr).find(":first-child");
        const radio = c1.find("input:radio:first");
        if (radio.length > 0) {
            const merchandise = new Merchandise();
            merchandise.id = "WEA_" + $(radio).val();
            merchandise.category = "武器";

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
            const c15 = c14.next();

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
            merchandise.weaponCategory = c14.text();
            merchandise.gemCount = parseInt(c15.text());
            merchandise.speciality = specialityMatch;

            weaponMerchandiseList.push(merchandise);
        } else if (c1.text() === "== 特产武器 ==") {
            specialityMatch = true;
        }
    });

    return weaponMerchandiseList;
}

export = TownWeaponHousePageParser;