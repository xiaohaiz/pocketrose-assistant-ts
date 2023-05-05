import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import TownGemHousePage from "./TownGemHousePage";
import TownGemMeltHouse from "./TownGemMeltHouse";
import Equipment from "../Equipment";

class TownGemHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static async parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }
}

async function doParsePage(pageHtml: string) {
    const action = (pageHtml: string) => {
        return new Promise<TownGemHousePage>(resolve => {
            const credential = PageUtils.parseCredential(pageHtml);
            const page = new TownGemHousePage(credential);

            const equipmentList: Equipment[] = [];
            $(pageHtml).find("td:contains('选择要合成的装备')")
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
            page.equipmentList = equipmentList;

            new TownGemMeltHouse(credential).enter()
                .then(townGemMeltHousePage => {
                    page.townGemMeltHousePage = townGemMeltHousePage;
                    resolve(page);
                });
        });
    };
    return await action(pageHtml);
}

export = TownGemHouse;