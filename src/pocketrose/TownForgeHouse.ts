import Role from "../core/role/Role";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import TownForgeHousePage from "./TownForgeHousePage";

class TownForgeHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownForgeHousePage> {
        return await (() => {
            return new Promise<TownForgeHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                request.set("con_str", "50");
                request.set("mode", "MY_ARM");
                NetworkUtils.post("town.cgi", request).then(html => {
                    const page = TownForgeHouse.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

    async repair(index: number): Promise<void> {
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                if (index < 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("select", index.toString());
                request.set("mode", "MY_ARM2");
                NetworkUtils.post("town.cgi", request).then(() => {
                    resolve();
                });
            });
        })();
    }

    static parsePage(html: string): TownForgeHousePage {
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

        const page = new TownForgeHousePage();
        page.role = role;
        return page;
    }

}

export = TownForgeHouse;