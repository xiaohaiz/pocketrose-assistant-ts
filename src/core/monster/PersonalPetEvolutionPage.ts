import StringUtils from "../../util/StringUtils";
import Role from "../role/Role";
import Pet from "./Pet";

class PersonalPetEvolutionPage {

    role?: Role;
    malePetList?: Pet[];
    femalePetList?: Pet[];
    evolutionPetList?: Pet[];
    degradationPetList?: Pet[];
    consecratePetList?: Pet[];

    findEvolutionPet(index: number, evolution: number) {
        for (const pet of this.evolutionPetList!) {
            if (pet.index === index && pet.evolution === evolution) {
                return pet;
            }
        }
        return null;
    }

    findDegradationPet(index: number) {
        for (const pet of this.degradationPetList!) {
            if (pet.index === index) {
                return pet;
            }
        }
        return null;
    }

    findConsecratePet(index: number) {
        for (const pet of this.consecratePetList!) {
            if (pet.index === index) {
                return pet;
            }
        }
        return null;
    }

    static parse(html: string): PersonalPetEvolutionPage {
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

        const malePetList: Pet[] = [];
        $(html).find("font:contains('父亲')")
            .filter((idx, font) => $(font).text() === "父亲")
            .next()
            .find("input:radio")
            .each((idx, radio) => {
                const c1 = $(radio).parent();
                const c2 = c1.next();
                const c3 = c2.next();
                const c4 = c3.next();
                const c5 = c4.next();
                const c6 = c5.next();
                const c7 = c6.next();
                const c8 = c7.next();
                const c9 = c8.next();

                const pet = new Pet();
                pet.index = parseInt($(radio).val() as string);
                pet.selectable = !$(radio).prop("disabled");
                pet.using = c2.text() === "★";
                pet.name = c3.text();
                pet.level = parseInt(c4.text());
                pet.attack = parseInt(c5.text());
                pet.defense = parseInt(c6.text());
                pet.specialAttack = parseInt(c7.text());
                pet.specialDefense = parseInt(c8.text());
                pet.speed = parseInt(c9.text());
                pet.gender = "公";
                if (pet.selectable) {
                    malePetList.push(pet);
                }
            });

        const femalePetList: Pet[] = [];
        $(html).find("font:contains('母亲')")
            .filter((idx, font) => $(font).text() === "母亲")
            .next()
            .find("input:radio")
            .each((idx, radio) => {
                const c1 = $(radio).parent();
                const c2 = c1.next();
                const c3 = c2.next();
                const c4 = c3.next();
                const c5 = c4.next();
                const c6 = c5.next();
                const c7 = c6.next();
                const c8 = c7.next();
                const c9 = c8.next();

                const pet = new Pet();
                pet.index = parseInt($(radio).val() as string);
                pet.selectable = !$(radio).prop("disabled");
                pet.using = c2.text() === "★";
                pet.name = c3.text();
                pet.level = parseInt(c4.text());
                pet.attack = parseInt(c5.text());
                pet.defense = parseInt(c6.text());
                pet.specialAttack = parseInt(c7.text());
                pet.specialDefense = parseInt(c8.text());
                pet.speed = parseInt(c9.text());
                pet.gender = "母";
                if (pet.selectable) {
                    femalePetList.push(pet);
                }
            });

        const evolutionPetList: Pet[] = [];
        $(html).find("input:submit[value='进化']")
            .parent()
            .find("table:first")
            .find("input:radio")
            .each((idx, radio) => {
                const c1 = $(radio).parent();
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
                const c12 = c11.next();

                let s = $(radio).val() as string;
                let s1 = StringUtils.substringBefore(s, ",");
                let s2 = StringUtils.substringAfter(s, ",");

                const pet = new Pet();
                pet.index = parseInt(s1);
                pet.selectable = !$(radio).prop("disabled");
                pet.using = c2.text() === "★";
                pet.name = c3.text();
                pet.level = parseInt(c4.text());
                pet.attack = parseInt(c5.text());
                pet.defense = parseInt(c6.text());
                pet.specialAttack = parseInt(c7.text());
                pet.specialDefense = parseInt(c8.text());
                pet.speed = parseInt(c9.text());
                pet.before = c10.text();
                pet.after = c11.text();
                pet.mapCount = parseInt(c12.text());
                pet.evolution = parseInt(s2);
                if (pet.selectable) {
                    evolutionPetList.push(pet);
                }
            });

        const degradationPetList: Pet[] = [];
        $(html).find("input:submit[value='退化']")
            .parent()
            .find("table:first")
            .find("input:radio")
            .each((idx, radio) => {
                const c1 = $(radio).parent();
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
                const c12 = c11.next();

                const pet = new Pet();
                pet.index = parseInt($(radio).val() as string);
                pet.selectable = !$(radio).prop("disabled");
                pet.using = c2.text() === "★";
                pet.name = c3.text();
                pet.level = parseInt(c4.text());
                pet.attack = parseInt(c5.text());
                pet.defense = parseInt(c6.text());
                pet.specialAttack = parseInt(c7.text());
                pet.specialDefense = parseInt(c8.text());
                pet.speed = parseInt(c9.text());
                pet.before = c10.text();
                pet.after = c11.text();
                pet.mapCount = parseInt(c12.text());
                if (pet.selectable) {
                    degradationPetList.push(pet);
                }
            });

        const consecratePetList: Pet[] = [];
        $(html).find("input:submit[value='封印']:first")
            .parent()
            .find("table:first")
            .find("input:radio")
            .each((idx, radio) => {
                const c1 = $(radio).parent();
                const c2 = c1.next();
                const c3 = c2.next();
                const c4 = c3.next();
                const c5 = c4.next();
                const c6 = c5.next();
                const c7 = c6.next();
                const c8 = c7.next();
                const c9 = c8.next();

                const pet = new Pet();
                pet.index = parseInt($(radio).val() as string);
                pet.selectable = !$(radio).prop("disabled");
                pet.using = c2.text() === "★";
                pet.name = c3.text();
                pet.level = parseInt(c4.text());
                pet.attack = parseInt(c5.text());
                pet.defense = parseInt(c6.text());
                pet.specialAttack = parseInt(c7.text());
                pet.specialDefense = parseInt(c8.text());
                pet.speed = parseInt(c9.text());
                if (pet.selectable) {
                    consecratePetList.push(pet);
                }
            });

        const page = new PersonalPetEvolutionPage();
        page.role = role;
        page.malePetList = malePetList;
        page.femalePetList = femalePetList;
        page.evolutionPetList = evolutionPetList;
        page.degradationPetList = degradationPetList;
        page.consecratePetList = consecratePetList;
        return page;
    }
}

export = PersonalPetEvolutionPage;