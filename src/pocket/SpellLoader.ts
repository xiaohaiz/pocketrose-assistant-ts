import {Spell} from "./Spell";
import StringUtils from "../util/StringUtils";

export class SpellLoader {

}

function doParseSpellList(pageHtml: string): Spell[] {
    const spellList: Spell[] = [];
    const select = $(pageHtml).find("select[name='ktec_no']");
    $(select).find("option").each(function (_idx, option) {
        const spell = new Spell();
        const id = $(option).val();
        if (id !== "") {
            spell.id = id as string;
            let s = $(option).text().trim();
            spell.name = StringUtils.substringBefore(s, "(");
            s = StringUtils.substringBetween(s, "(", ")");
            const ss = s.split(" | ");
            spell.power = parseInt(StringUtils.substringAfter(ss[0], "威力:"));
            spell.accuracy = parseInt(StringUtils.substringAfter(ss[1], "确率:"));
            spell.pp = parseInt(StringUtils.substringAfter(ss[2], "消费MP:"));
            spellList.push(spell);
        }
    });
    return spellList;
}