import Pet from "./Pet";
import StringUtils from "../../util/StringUtils";
import PersonalPetManagementPage from "./PersonalPetManagementPage";
import _ from "lodash";
import PetLeaguePlayer from "./PetLeaguePlayer";

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
                PersonalPetManagementPageParser._parsePet(pet, table);
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

        const petLeagueTable = $(html)
            .find("center:contains('已登陆宠物联赛的宠物一览')")
            .filter((_idx, center) => {
                const text = $(center).text();
                return _.startsWith(text, "已登陆宠物联赛的宠物一览");
            })
            .find("> form:first")
            .find("> table:first")
            .find("> tbody:first");
        const petLeagueTableHTML = petLeagueTable.html();
        const petLeaguePlayerList: PetLeaguePlayer[] = [];
        petLeagueTable.find("> tr")
            .filter((idx, _tr) => idx > 0)
            .each((_idx, it) => {
                const tr = $(it);
                const player = new PetLeaguePlayer();

                const c1 = tr.find("> td:first")
                    .find("> input:checkbox");
                player.index = _.parseInt(c1.val() as string);
                player.online = c1.prop("checked");
                const c2 = tr.find("> td:eq(1)")
                    .find("> input:checkbox");
                player.mainForce = c2.prop("checked");
                player.name = tr.find("> td:eq(2)").text();
                player.maxHealth = _.parseInt(tr.find("> td:eq(3)").text());
                player.attack = _.parseInt(tr.find("> td:eq(4)").text());
                player.defense = _.parseInt(tr.find("> td:eq(5)").text());
                player.specialAttack = _.parseInt(tr.find("> td:eq(6)").text());
                player.specialDefense = _.parseInt(tr.find("> td:eq(7)").text());
                player.speed = _.parseInt(tr.find("> td:eq(8)").text());

                petLeaguePlayerList.push(player);
            });

        const page = new PersonalPetManagementPage();
        page.petList = petList;
        page.petStudyStatus = studyStatus;
        page.petLeaguePlayerList = petLeaguePlayerList;
        page.petLeagueTableHTML = petLeagueTableHTML;
        return page;
    }

    static _parsePet(pet: Pet, table: JQuery<HTMLElement>) {
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