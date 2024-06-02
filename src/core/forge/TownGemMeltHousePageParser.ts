import TownGemMeltHousePage from "./TownGemMeltHousePage";
import {Equipment} from "../equipment/Equipment";

class TownGemMeltHousePageParser {

    static parse(html: string): TownGemMeltHousePage {
        const page = new TownGemMeltHousePage();

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

                page.equipmentList.push(equipment);
            });

        return page;
    }

}

export {TownGemMeltHousePageParser};