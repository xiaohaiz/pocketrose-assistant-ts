import PetProfile from "../common/PetProfile";
import StringUtils from "../util/StringUtils";

class TownPetProfileHousePage {

    profile?: PetProfile;

    static parse(html: TownPetProfileHousePage) {
        const profile = new PetProfile();
        profile.spellList = [];
        $(html)
            .find("td:contains('宠物名 ：')")
            .filter((idx, td) => $(td).text().startsWith("宠物名 ："))
            .each((idx, td) => {
                let s = $(td).text();
                s = StringUtils.substringBetween(s, "宠物名 ： ", " (");
                profile.parseName(s);
            })
            .parent()
            .next()
            .find("td:first")
            .next()
            .find("table:first")
            .find("tr")
            .each((idx, tr) => {
                const td = $(tr).find("td:first");
                let s = td.text();
                if (s.startsWith("技") && !s.includes("描述")) {
                    s = td.next().text();
                    s = StringUtils.substringBefore(s, "(威力");
                    profile.spellList!.push(s);
                }
            });
        const page = new TownPetProfileHousePage();
        page.profile = profile;
        return page;
    }
}

export = TownPetProfileHousePage;