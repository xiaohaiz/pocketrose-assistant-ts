import Mirror from "../common/Mirror";
import StringUtils from "../util/StringUtils";

class PersonalMirrorPage {

    mirrorList?: Mirror[];

    findByIndex(index: number) {
        for (const mirror of this.mirrorList!) {
            if (mirror.index === index) {
                return mirror;
            }
        }
        return null;
    }

    findByCategory(category: string) {
        for (const mirror of this.mirrorList!) {
            if (mirror.category === category) {
                return mirror;
            }
        }
        return null;
    }

    static parse(html: string) {
        const mirrorList: Mirror[] = [];

        $(html).find("input:radio").each((idx, radio) => {
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
            const c13 = c12.next();
            const c14 = c13.next();
            const c15 = c14.next();
            const c16 = c15.next();
            const c17 = c16.next();
            const c18 = c17.next();

            const mirror = new Mirror();
            mirror.index = parseInt($(radio).val() as string);
            mirror.category = c2.text();
            mirror.image = StringUtils.substringAfterSlash(c3.find("img:first").attr("src")!);
            mirror.name = c4.text();
            mirror.gender = c5.text();
            mirror.health = parseInt(c6.text());
            mirror.maxHealth = parseInt(c7.text());
            mirror.mana = parseInt(c9.text());
            mirror.maxMana = parseInt(c9.text());
            mirror.attribute = c10.text();
            mirror.attack = parseInt(c11.text());
            mirror.defense = parseInt(c12.text());
            mirror.specialAttack = parseInt(c13.text());
            mirror.specialDefense = parseInt(c14.text());
            mirror.speed = parseInt(c15.text());
            mirror.career = c16.text();
            mirror.spell = StringUtils.substringBefore(c17.text(), "(威力");
            mirror.experience = parseInt(c18.text());

            mirrorList.push(mirror);
        });

        const page = new PersonalMirrorPage();
        page.mirrorList = mirrorList;
        return page;
    }
}

export = PersonalMirrorPage;