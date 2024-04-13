import Mirror from "./Mirror";
import StringUtils from "../../util/StringUtils";
import PersonalMirrorPage from "./PersonalMirrorPage";
import _ from "lodash";

class PersonalMirrorPageParser {

    static parsePage(html: string) {
        const welcomeMessage = $(html).find("img[alt='神官']")
            .parent()
            .prev()
            .find("> font:first")
            .html();

        const currentMirror = PersonalMirrorPageParser._parseCurrentMirror(html);

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
            mirror.image = StringUtils.substringAfterLast(c3.find("img:first").attr("src")!, "/");
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
            mirror.using = false;

            mirrorList.push(mirror);
        });

        const page = new PersonalMirrorPage();
        page.welcomeMessage = welcomeMessage;
        page.currentMirror = currentMirror;
        page.mirrorList = mirrorList;
        return page;
    }

    private static _parseCurrentMirror(html: string) {
        let mirrorIndex: number;
        if (_.includes(html, "当前分身:本体")) {
            mirrorIndex = 0;
        } else {
            let s = StringUtils.substringAfter(html, "当前分身:第");
            s = StringUtils.substringBefore(s, "分身");
            mirrorIndex = _.parseInt(s);
        }

        const mirror = new Mirror();
        mirror.index = mirrorIndex;
        if (mirrorIndex === 0) {
            mirror.category = "本体";
        } else {
            mirror.category = "第" + mirrorIndex + "分身";
        }

        const table = $(html).find("table:eq(2)");
        const c0 = table.find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first");
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
        const c12 = c11.next();
        const c13 = c12.next();
        const c14 = c13.next();
        const c15 = c14.next();

        mirror.image = StringUtils.substringAfterLast(c0.find("img:first").attr("src")!, "/");
        mirror.name = c1.text();
        mirror.gender = c2.text();
        mirror.health = parseInt(c3.text());
        mirror.maxHealth = parseInt(c4.text());
        mirror.mana = parseInt(c5.text());
        mirror.maxMana = parseInt(c6.text());
        mirror.attribute = c7.text();
        mirror.attack = parseInt(c8.text());
        mirror.defense = parseInt(c9.text());
        mirror.specialAttack = parseInt(c10.text());
        mirror.specialDefense = parseInt(c11.text());
        mirror.speed = parseInt(c12.text());
        mirror.career = c13.text();
        mirror.spell = StringUtils.substringBefore(c14.text(), "(威力");
        mirror.experience = parseInt(c15.text());
        mirror.using = true;

        return mirror;
    }

}

export = PersonalMirrorPageParser;