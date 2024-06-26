import PetMap from "./PetMap";
import Role from "../role/Role";
import StringUtils from "../../util/StringUtils";
import TownPetMapHousePage from "./TownPetMapHousePage";

class TownPetMapHousePageParser {

    static parsePage(html: string): TownPetMapHousePage {
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

export {TownPetMapHousePageParser};