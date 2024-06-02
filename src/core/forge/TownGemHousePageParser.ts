import Credential from "../../util/Credential";
import {Equipment} from "../equipment/Equipment";
import TownGemHousePage from "./TownGemHousePage";
import TownGemMeltHouse from "./TownGemMeltHouse";
import {parseInt} from "lodash";

class TownGemHousePageParser {

    private readonly credential: Credential;
    private readonly townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.credential = credential;
        this.townId = townId;
    }

    async parsePage(html: string): Promise<TownGemHousePage> {
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
        page.equipmentList = equipmentList;
        page.gemList = gemList;
        page.townGemMeltHousePage = await new TownGemMeltHouse(this.credential, this.townId).open();
        return page;
    }
}

export {TownGemHousePageParser}