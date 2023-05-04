import Pet from "./Pet";
import StringUtils from "../util/StringUtils";

class CastleRanch {

    static parsePersonalPetList(pageHtml: string): Pet[] {
        const petList: Pet[] = [];
        $(pageHtml).find("td:contains('放入城堡牧场')")
            .filter(function () {
                return $(this).text() === "放入城堡牧场";
            })
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
                const c8 = c7.next();
                const c9 = c8.next();
                const c10 = c9.next();
                const c11 = c10.next();

                const pet = new Pet();
                pet.index = parseInt($(radio).val() as string);
                pet.selectable = !$(radio).prop("disabled");
                pet.using = c1.text() === "★使用";
                pet.name = c2.text();
                pet.level = parseInt(c3.text());
                let s = c4.text();
                pet.health = parseInt(StringUtils.substringBeforeSlash(s));
                pet.maxHealth = parseInt(StringUtils.substringAfterSlash(s));
                pet.attack = parseInt(c5.text());
                pet.defense = parseInt(c6.text());
                pet.specialAttack = parseInt(c7.text());
                pet.specialDefense = parseInt(c8.text());
                pet.speed = parseInt(c9.text());
                pet.experience = parseInt(c10.text());
                pet.gender = c11.text();

                petList.push(pet);
            });
        return petList;
    }

    static parseRanchPetList(pageHtml: string): Pet[] {
        const petList: Pet[] = [];
        $(pageHtml).find("td:contains('从城堡仓库取出')")
            .filter(function () {
                return $(this).text() === "从城堡仓库取出";
            })
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
                const c8 = c7.next();
                const c9 = c8.next();
                const c10 = c9.next();

                const pet = new Pet();
                pet.index = parseInt($(radio).val() as string);
                pet.selectable = true;
                pet.name = c1.text();
                pet.level = parseInt(c2.text());
                let s = c3.text();
                pet.health = parseInt(StringUtils.substringBeforeSlash(s));
                pet.maxHealth = parseInt(StringUtils.substringAfterSlash(s));
                pet.attack = parseInt(c4.text());
                pet.defense = parseInt(c5.text());
                pet.specialAttack = parseInt(c6.text());
                pet.specialDefense = parseInt(c7.text());
                pet.speed = parseInt(c8.text());
                pet.experience = parseInt(c9.text());
                pet.gender = c10.text();

                petList.push(pet);
            });
        return petList;
    }

}

export = CastleRanch;