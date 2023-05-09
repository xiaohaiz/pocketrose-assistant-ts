import Equipment from "../../common/Equipment";
import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import DeprecatedTownGemHousePage from "./DeprecatedTownGemHousePage";
import DeprecatedTownGemMeltHouse from "./DeprecatedTownGemMeltHouse";

/**
 * @deprecated
 */
class DeprecatedTownGemHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static async parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }

    async enter() {
        const action = (credential: Credential) => {
            return new Promise<DeprecatedTownGemHousePage>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request.con_str = "50";
                // @ts-ignore
                request.mode = "BAOSHI_SHOP";
                NetworkUtils.sendPostRequest("town.cgi", request, function (pageHtml) {
                    DeprecatedTownGemHouse.parsePage(pageHtml)
                        .then(page => {
                            resolve(page);
                        });
                });
            });
        };
        return await action(this.#credential);
    }
}

async function doParsePage(pageHtml: string) {
    const action = (pageHtml: string) => {
        return new Promise<DeprecatedTownGemHousePage>(resolve => {
            const credential = PageUtils.parseCredential(pageHtml);
            const page = new DeprecatedTownGemHousePage(credential);

            $(pageHtml).find("td:contains('所持金')")
                .filter(function () {
                    return $(this).text() === "所持金";
                })
                .next()
                .each(function (_idx, td) {
                    let s = $(td).text();
                    s = StringUtils.substringBefore(s, " GOLD");
                    page.roleCash = parseInt(s);
                });

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

            const gemList: Equipment[] = [];
            $(pageHtml).find("td:contains('选择要使用的宝石')")
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
            page.gemList = gemList;

            new DeprecatedTownGemMeltHouse(credential).enter()
                .then(townGemMeltHousePage => {
                    page.townGemMeltHousePage = townGemMeltHousePage;
                    resolve(page);
                });
        });
    };
    return await action(pageHtml);
}

export = DeprecatedTownGemHouse;