import WeaponSkill from "./WeaponSkill";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";

class WeaponSkillParser {

    static parse(pageHTML: string): WeaponSkill[] {
        const skills: WeaponSkill[] = [];
        const dom = $(pageHTML);
        const table = dom.find("td:contains('技  能')")
            .filter((_idx, e) => {
                const t = $(e).text();
                return t === "技  能";
            })
            .closest("table");
        table.find("> tbody:first")
            .find("> tr")
            .filter(idx => idx > 0)
            .each((_idx, e) => {
                const tr = $(e);
                const skill = new WeaponSkill();

                let s = tr.find("> td:first").text();
                skill.name = StringUtils.substringBefore(s, "(");
                skill.code = StringUtils.substringBetween(s, "(", ")");

                skill.rankHTML = tr.find("> td:eq(1)").html();

                s = tr.find("> td:eq(2)").text();
                const s1 = StringUtils.substringBefore(s, "/");
                const s2 = StringUtils.substringAfter(s, "/");
                skill.level = _.parseInt(StringUtils.substringAfter(s1, "等级:"));
                skill.experience = _.parseInt(StringUtils.substringAfter(s2, "经验:"));

                skills.push(skill);
            });
        return skills.filter(it => !_.includes(TRASH_WEAPON_SKILL_CODE, it.code))
            .sort((a, b) => {
                const l1 = a.level!;
                const l2 = b.level!;
                if (l1 !== l2) return l2 - l1;
                const e1 = a.experience!;
                const e2 = b.experience!;
                if (e1 !== e2) return e2 - e1;
                return a.code!.localeCompare(b.code!);
            });
    }

}

const TRASH_WEAPON_SKILL_CODE = [
    "literate",
];

export = WeaponSkillParser;