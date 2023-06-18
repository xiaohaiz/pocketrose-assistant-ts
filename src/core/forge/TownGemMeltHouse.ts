import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import StringUtils from "../../util/StringUtils";
import Equipment from "../equipment/Equipment";
import Role from "../role/Role";
import TownGemMeltHousePage from "./TownGemMeltHousePage";

class TownGemMeltHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    static parsePage(html: string): TownGemMeltHousePage {
        return doParsePage(html);
    }

    async open(): Promise<TownGemMeltHousePage> {
        const action = () => {
            return new Promise<TownGemMeltHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("con_str", "50");
                request.set("mode", "BAOSHI_DELSHOP");
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                NetworkUtils.post("town.cgi", request).then(html => {
                    const page = TownGemMeltHouse.parsePage(html);
                    resolve(page);
                });
            });
        };
        return await action();
    }

    async melt(index: number): Promise<void> {
        const action = () => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("select", index.toString());
                request.set("azukeru", "0");
                request.set("mode", "BAOSHI_DELETE");
                NetworkUtils.post("town.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        };
        return await action();
    }
}

function doParsePage(html: string): TownGemMeltHousePage {
    const role = new Role();
    $(html)
        .find("td:contains('姓名')")
        .filter((_idx, td) => $(td).text() === "姓名")
        .closest("table")
        .find("tr:first")
        .next()
        .find("td:first")
        .each((_idx, td) => {
            role.name = $(td).text();
        })
        .next()
        .each((_idx, td) => {
            let s = $(td).text();
            role.level = parseInt(s);
        })
        .next()
        .each((_idx, td) => {
            let s = $(td).text();
            role.attribute = StringUtils.substringBefore(s, "属");
        })
        .next()
        .each((_idx, td) => {
            role.career = $(td).text();
        })
        .parent()
        .next()
        .find("td:first")
        .next()
        .each((_idx, td) => {
            let s = $(td).text();
            s = StringUtils.substringBefore(s, " GOLD");
            role.cash = parseInt(s);
        });

    const equipmentList: Equipment[] = [];
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

            equipmentList.push(equipment);
        });

    const page = new TownGemMeltHousePage();
    page.role = role;
    page.equipmentList = equipmentList;
    return page;
}

export = TownGemMeltHouse;