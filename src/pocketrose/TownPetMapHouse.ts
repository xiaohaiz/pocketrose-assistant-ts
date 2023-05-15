import PetMap from "../common/PetMap";
import Role from "../common/Role";
import StringUtils from "../util/StringUtils";
import TownPetMapHousePage from "./TownPetMapHousePage";

class TownPetMapHouse {

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
        $(html).find("table:eq(1)")
            .find("td")
            .each(function (_i, element) {
                const img = $(element).find("img:first");
                if (img.length > 0) {
                    const code = img.attr("alt")!;
                    const picture = StringUtils.substringAfterLast(img.attr("src")!, "/");
                    const count = parseInt($(element).next().text());

                    const pm = new PetMap();
                    pm.code = code;
                    pm.picture = picture;
                    pm.count = count;
                    petMapList.push(pm);
                }
            });

        const page = new TownPetMapHousePage();
        page.role = role;
        page.petMapList = petMapList;
        return page;
    }
}

export = TownPetMapHouse;