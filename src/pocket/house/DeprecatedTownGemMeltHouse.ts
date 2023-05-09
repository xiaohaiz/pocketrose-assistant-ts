import Equipment from "../../common/Equipment";
import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import PageUtils from "../../util/PageUtils";
import DeprecatedTownGemMeltHousePage from "./DeprecatedTownGemMeltHousePage";

/**
 * @deprecated
 */
class DeprecatedTownGemMeltHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }

    async enter() {
        const action = (credential: Credential) => {
            return new Promise<DeprecatedTownGemMeltHousePage>(resolve => {
                const request = credential.asRequest();
                // request.town = townId;
                // @ts-ignore
                request.con_str = "50";
                // @ts-ignore
                request.mode = "BAOSHI_DELSHOP";
                NetworkUtils.sendPostRequest("town.cgi", request, function (pageHtml) {
                    const page = DeprecatedTownGemMeltHouse.parsePage(pageHtml);
                    resolve(page);
                });
            });
        };
        return await action(this.#credential);
    }
}

function doParsePage(pageHtml: string) {
    const credential = PageUtils.parseCredential(pageHtml);
    const page = new DeprecatedTownGemMeltHousePage(credential);

    const equipmentList: Equipment[] = [];
    $(pageHtml).find("input:radio")
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
    page.equipmentList = equipmentList;

    return page;
}

export = DeprecatedTownGemMeltHouse;