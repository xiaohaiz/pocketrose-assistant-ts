import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import StringUtils from "../../util/StringUtils";
import Role from "../role/Role";
import Equipment from "./Equipment";
import TownEquipmentExpressHousePage from "./TownEquipmentExpressHousePage";

class TownEquipmentExpressHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownEquipmentExpressHousePage> {
        return await (() => {
            return new Promise<TownEquipmentExpressHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                request.set("con_str", "50");
                request.set("mode", "ITEM_SEND");
                NetworkUtils.post("town.cgi", request).then(html => {
                    const page = TownEquipmentExpressHouse.parsePage(html);
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
                request.set("mode", "ITEM_SEND");
                // noinspection JSDeprecatedSymbols
                request.set("serch", escape(name.trim()));
                NetworkUtils.post("town.cgi", request).then(html => {
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
                request.set("mode", "ITEM_SEND2");
                request.set("eid", target.trim());
                for (const index of indexList) {
                    request.set("item" + index, index.toString());
                }
                NetworkUtils.post("town.cgi", request).then(html => {
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

    static parsePage(html: string): TownEquipmentExpressHousePage {
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
                role.attribute = StringUtils.substringBefore($(td).text(), "属");
            })
            .next()
            .each((idx, td) => {
                role.attribute = $(td).text();
            })
            .parent()
            .next()
            .find("td:first")
            .next()
            .each((idx, td) => {
                let s = $(td).text();
                s = StringUtils.substringBefore(s, " GOLD");
                role.cash = parseInt(s);
            });

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

        const page = new TownEquipmentExpressHousePage();
        page.role = role;
        page.equipmentList = equipmentList;
        return page;
    }
}

export = TownEquipmentExpressHouse;