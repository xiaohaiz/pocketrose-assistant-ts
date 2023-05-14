import Role from "../common/Role";
import StringUtils from "../util/StringUtils";
import PersonalCareerManagementPage from "./PersonalCareerManagementPage";

class PersonalCareerManagement {

    static parsePage(html: string) {
        const role = new Role();
        $(html).find("input:radio:first")
            .parent()
            .next()         // name
            .each((idx, td) => {
                role.name = $(td).text();
            })
            .next()         // level
            .each((idx, td) => {
                role.level = parseInt($(td).text());
            })
            .next()         // health
            .each((idx, td) => {
                role.parseHealth($(td).text());
            })
            .next()         // mana
            .each((idx, td) => {
                role.parseMana($(td).text());
            })
            .next()         // attribute
            .each((idx, td) => {
                role.attribute = $(td).text();
            })
            .next()         // career
            .each((idx, td) => {
                role.career = $(td).text();
            })
            .parent()
            .find("td:first")
            .next()         // cash
            .each((idx, td) => {
                let s = $(td).text();
                s = StringUtils.substringBefore(s, " GOLD");
                role.cash = parseInt(s);
            });

        const careerCandidateList: string[] = [];
        $(html)
            .find("select[name='syoku_no']")
            .find("option")
            .each(function (_idx, option) {
                const value = $(option).val();
                if (value !== "") {
                    const career = $(option).text().trim();
                    careerCandidateList.push(career);
                }
            });

        const page = new PersonalCareerManagementPage();
        page.role = role;
        page.careerList = careerCandidateList;
        return page;
    }

}

export = PersonalCareerManagement;