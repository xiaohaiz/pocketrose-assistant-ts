import Pet from "./Pet";
import StringUtils from "../../util/StringUtils";
import PersonalPetManagementPage from "./PersonalPetManagementPage";

class PersonalPetManagementPageParser {

    static parsePage(html: string): PersonalPetManagementPage {
        const petList: Pet[] = [];
        $(html).find("input:radio[name='select']").each(function (_idx, radio) {
            const index = $(radio).val() as string;
            if (parseInt(index) >= 0) {
                // index为-1的意味着“无宠物”那个选项
                const table = $(radio).closest("table");
                // pet index & using
                const pet = new Pet();
                pet.index = parseInt(index);
                const usingText = radio.nextSibling!.nodeValue;
                if (usingText === "未使用") {
                    pet.using = false;
                }
                if (usingText === "★使用") {
                    pet.using = true;
                }
                PersonalPetManagementPageParser.#parsePet(pet, table);
                petList.push(pet);
            }
        });

        const studyStatus: number[] = [];
        $(html).find("input:checkbox:checked").each(function (_idx, checkbox) {
            const name = $(checkbox).attr("name") as string;
            if (name.startsWith("study")) {
                studyStatus.push(parseInt($(checkbox).val() as string));
            }
        });

        const page = new PersonalPetManagementPage();
        page.petList = petList;
        page.petStudyStatus = studyStatus;
        return page;
    }

    static #parsePet(pet: Pet, table: JQuery<HTMLElement>) {
        // pet name & gender
        const nameCell = table.find("td:first");
        let petNameText = nameCell.find("b").text();
        petNameText = petNameText.substring(1);
        pet.name = petNameText.substring(0, petNameText.length - 1);
        let fullNameText = nameCell.text();
        if (fullNameText.endsWith("(公)")) {
            pet.gender = "公";
        } else if (fullNameText.endsWith("(母)")) {
            pet.gender = "母";
        } else if (fullNameText.endsWith("(无性)")) {
            pet.gender = "无性";
        }

        // pet level
        let s = table.find("tr:eq(1) td:first").text();
        pet.level = parseInt(StringUtils.substringAfter(s, "Ｌｖ"));

        // pet picture & health
        s = table.find("tr:eq(2) td:eq(0) img").attr("src") as string;
        pet.picture = s.substring(s.lastIndexOf("/") + 1);
        s = table.find("tr:eq(2) td:eq(2)").text();
        pet.health = parseInt(StringUtils.substringBeforeSlash(s));
        pet.maxHealth = parseInt(StringUtils.substringAfterSlash(s));

        // pet spells
        s = table.find("tr:eq(3) td:eq(1)").text();
        pet.spell1 = StringUtils.substringBefore(s, "(威力：");
        pet.usingSpell1 = s.includes("(使用中)");
        pet.spell1Description = s;
        pet.spell1Description += " " + table.find("tr:eq(4) td:eq(1)").text();
        s = table.find("tr:eq(5) td:eq(1)").text();
        pet.spell2 = StringUtils.substringBefore(s, "(威力：");
        pet.usingSpell2 = s.includes("(使用中)");
        pet.spell2Description = s;
        pet.spell2Description += " " + table.find("tr:eq(6) td:eq(1)").text();
        s = table.find("tr:eq(7) td:eq(1)").text();
        pet.spell3 = StringUtils.substringBefore(s, "(威力：");
        pet.usingSpell3 = s.includes("(使用中)");
        pet.spell3Description = s;
        pet.spell3Description += " " + table.find("tr:eq(8) td:eq(1)").text();
        s = table.find("tr:eq(9) td:eq(1)").text();
        pet.spell4 = StringUtils.substringBefore(s, "(威力：");
        pet.usingSpell4 = s.includes("(使用中)");
        pet.spell4Description = s;
        pet.spell4Description += " " + table.find("tr:eq(10) td:eq(1)").text();

        // pet attack & defense
        s = table.find("tr:eq(11) td:eq(1)").text();
        pet.attack = parseInt(s);
        s = table.find("tr:eq(11) td:eq(3)").text();
        pet.defense = parseInt(s);

        // pet specialAttack & specialDefense
        s = table.find("tr:eq(12) td:eq(1)").text();
        pet.specialAttack = parseInt(s);
        s = table.find("tr:eq(12) td:eq(3)").text();
        pet.specialDefense = parseInt(s);

        // pet speed & love
        s = table.find("tr:eq(13) td:eq(1)").text();
        pet.speed = parseInt(s);
        s = table.find("tr:eq(13) td:eq(3)").text();
        pet.love = parseFloat(s);

        // pet attributes
        pet.attribute1 = table.find("tr:eq(14) td:eq(1)").text();
        pet.attribute2 = table.find("tr:eq(14) td:eq(3)").text();

        // pet race & code
        s = table.find("tr:eq(16) td:eq(3)").text();
        pet.race = s;
        pet.code = StringUtils.substringBetween(s, "(", ")");
    }
}

export = PersonalPetManagementPageParser;