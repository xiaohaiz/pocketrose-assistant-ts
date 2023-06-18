import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import StringUtils from "../../util/StringUtils";
import Role from "../role/Role";
import PetMap from "./PetMap";
import TownPetMapHousePage from "./TownPetMapHousePage";

class TownPetMapHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownPetMapHousePage> {
        return await (() => {
            return new Promise<TownPetMapHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                request.set("con_str", "50");
                request.set("mode", "PETMAP");
                NetworkUtils.post("town.cgi", request).then(html => {
                    const page = TownPetMapHouse.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

    static parsePage(html: string) {
        const role = new Role();
        $(html).find("td:contains('ＬＶ')")
            .filter((idx, td) => $(td).text() === "ＬＶ")
            .parent()
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
            });

        const petMapList: PetMap[] = [];
        $(html).find("td")
            .each(function (idx, td) {
                const img = $(td).find("img:first");
                if (img.length > 0) {
                    const src = img.attr("src")!;
                    if (src.includes("/386/")) {
                        const code = img.attr("alt")!;
                        const picture = StringUtils.substringAfterLast(src, "/");
                        const count = parseInt($(td).next().text());

                        const pm = new PetMap();
                        pm.code = code;
                        pm.picture = picture;
                        pm.count = count;
                        petMapList.push(pm);
                    }
                }
            });

        const page = new TownPetMapHousePage();
        page.role = role;
        page.petMapList = petMapList;
        return page;
    }
}

export = TownPetMapHouse;