import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import StringUtils from "../../util/StringUtils";
import Role from "../role/Role";
import CastleEquipmentExpressHousePage from "./CastleEquipmentExpressHousePage";
import {Equipment} from "./Equipment";

class CastleEquipmentExpressHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<CastleEquipmentExpressHousePage> {
        return await (() => {
            return new Promise<CastleEquipmentExpressHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("mode", "CASTLE_SENDITEM");
                NetworkUtils.post("castle.cgi", request).then(html => {
                    const page = CastleEquipmentExpressHouse.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

    async search(name: string): Promise<string> {
        return await (() => {
            return new Promise<string>((resolve, reject) => {
                if (name.trim() === "") {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("mode", "CASTLE_SENDITEM");
                // noinspection JSDeprecatedSymbols
                request.set("serch", escape(name.trim()));
                NetworkUtils.post("castle.cgi", request).then(html => {
                    const optionListHtml = $(html).find("select:first").html();
                    resolve(optionListHtml);
                });
            });
        })();
    }

    async send(target: string, indexList: number[]): Promise<void> {
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                if (target.trim() === "" || indexList.length === 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("mode", "CASTLE_SENDITEM2");
                request.set("eid", target.trim());
                for (const index of indexList) {
                    request.set("item" + index, index.toString());
                }
                NetworkUtils.post("castle.cgi", request).then(html => {
                    if (html.includes("所持金不足")) {
                        reject();
                    } else {
                        MessageBoard.processResponseMessage(html);
                        resolve();
                    }
                });
            });
        })();
    }

    static parsePage(html: string): CastleEquipmentExpressHousePage {
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
                let s = $(td).text();
                role.attribute = StringUtils.substringBefore(s, "属");
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

        const equipmentList: Equipment[] = [];
        $(html).find("input:checkbox")
            .each((idx, checkbox) => {
                const equipment = new Equipment();
                let s = $(checkbox).val() as string;
                equipment.index = parseInt(s);
                equipment.selectable = !$(checkbox).prop("disabled");
                const c1 = $(checkbox).parent();
                const c2 = c1.next();
                const c3 = c2.next();
                const c4 = c3.next();
                const c5 = c4.next();
                const c6 = c5.next();

                equipment.using = c2.text() === "★";
                equipment.parseName(c3.html());
                equipment.category = c4.text();
                equipment.power = parseInt(c5.text());
                equipment.weight = parseInt(c6.text());

                equipmentList.push(equipment);
            });

        const page = new CastleEquipmentExpressHousePage();
        page.role = role;
        page.equipmentList = equipmentList;
        return page;
    }

}

export = CastleEquipmentExpressHouse;