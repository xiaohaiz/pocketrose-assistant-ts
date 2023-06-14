import Equipment from "../core/equipment/Equipment";
import Role from "../core/role/Role";
import Merchandise from "../core/store/Merchandise";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import TownItemHousePage from "./TownItemHousePage";

class TownItemHouse {

    readonly #credential: Credential;
    readonly #townId: string;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    static parsePage(html: string): TownItemHousePage {
        return __parsePage(html);
    }

    async open(): Promise<TownItemHousePage> {
        const action = () => {
            return new Promise<TownItemHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("town", this.#townId);
                request.set("con_str", "50");
                request.set("mode", "ITEM_SHOP");
                NetworkUtils.post("town.cgi", request).then(html => {
                    const page = TownItemHouse.parsePage(html);
                    resolve(page);
                });
            });
        };
        return await action();
    }

    async sell(equipmentIndex: number, discount: number): Promise<void> {
        const action = () => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("select", equipmentIndex.toString());
                request.set("val_off", discount.toString());
                request.set("mode", "SELL");
                NetworkUtils.post("town.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        };
        return await action();
    }

    async buy(merchandiseIndex: number, count: number, discount: number): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                const request = this.#credential.asRequestMap();
                request.set("select", merchandiseIndex.toString());
                request.set("townid", this.#townId);
                request.set("val_off", discount.toString());
                request.set("mark", "3");
                request.set("mode", "BUY");
                request.set("num", count.toString());
                NetworkUtils.post("town.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    if (html.includes("所持金不足")) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            });
        };
        return await action();
    }
}

function __parsePage(html: string): TownItemHousePage {
    const townId = $(html).find("input:hidden[name='townid']:first").val() as string;

    let discount = 1;
    const input = $(html).find("input:hidden[name='val_off']:first");
    if (input.length > 0) {
        discount = parseFloat(input.val() as string);
    }

    const role = new Role();
    $(html).find("td:contains('姓名')")
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
        });

    const equipmentList: Equipment[] = [];
    $(html)
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

            equipmentList.push(equipment);
        });

    const merchandiseList: Merchandise[] = [];
    const table = $(html).find("input:radio:last")
        .closest("table");
    table.find("tr").each(function (_idx, tr) {
        const c1 = $(tr).find(":first-child");
        const radio = c1.find("input:radio:first");
        if (radio.length > 0) {
            const merchandise = new Merchandise();
            merchandise.id = "ITE_" + $(radio).val();
            merchandise.category = "物品";

            const c2 = c1.next();
            const c3 = c2.next();
            const c4 = c3.next();
            const c5 = c4.next();
            const c6 = c5.next();
            const c7 = c6.next();

            merchandise.name = c2.text();
            merchandise.nameHtml = c2.html();
            let s = c3.text();
            s = StringUtils.substringBefore(s, " Gold");
            merchandise.price = parseInt(s);
            merchandise.power = parseInt(c4.text());
            merchandise.weight = parseInt(c5.text());
            merchandise.endure = parseInt(c6.text());
            merchandise.attribute = c7.text();
            merchandise.speciality = false;
            merchandiseList.push(merchandise);
        }
    });

    const page = new TownItemHousePage();
    page.townId = townId;
    page.discount = discount;
    page.role = role;
    page.equipmentList = equipmentList;
    page.merchandiseList = merchandiseList;

    return page;
}

export = TownItemHouse;