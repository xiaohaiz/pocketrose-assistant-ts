import PersonalEquipmentManagementPage from "./PersonalEquipmentManagementPage";
import Role from "../role/Role";
import StringUtils from "../../util/StringUtils";
import {Equipment} from "./Equipment";

class PersonalEquipmentManagementPageParser {

    static parsePage(html: string): PersonalEquipmentManagementPage {
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
                let s = $(td).text();
                role.level = parseInt(s);
            })
            .next()
            .each((idx, td) => {
                let s = $(td).text();
                role.parseHealth(s);
            })
            .next()
            .each((idx, td) => {
                let s = $(td).text();
                role.parseMana(s);
            })
            .next()
            .each((idx, td) => {
                role.attribute = $(td).text();
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


        const page = new PersonalEquipmentManagementPage();
        page.role = role;
        page.equipmentList = PersonalEquipmentManagementPageParser.#parseEquipmentList(html);
        return page;
    }

    static #parseEquipmentList(html: string) {
        const equipmentList: Equipment[] = [];
        $(html).find("input:checkbox").each(function (_idx, checkbox) {
            const equipment = new Equipment();
            const tr = $(checkbox).parent().parent();

            // index & selectable
            equipment.index = parseInt($(checkbox).val() as string);
            equipment.selectable = !$(checkbox).prop("disabled");

            // using
            let s = $(tr).find("th:first").text();
            equipment.using = (s === "★");

            // name & star
            equipment.parseName($(tr).find("td:eq(1)").html());

            // category
            s = $(tr).find("td:eq(2)").text();
            equipment.category = s;

            // power & weight & endure
            s = $(tr).find("td:eq(3)").text();
            equipment.power = parseInt(s);
            s = $(tr).find("td:eq(4)").text();
            equipment.weight = parseInt(s);
            s = $(tr).find("td:eq(5)").text();
            equipment.endure = parseInt(s);

            // required career
            s = $(tr).find("td:eq(6)").text();
            equipment.requiredCareer = s;

            // required stats
            s = $(tr).find("td:eq(7)").text();
            equipment.requiredAttack = parseInt(s);
            s = $(tr).find("td:eq(8)").text();
            equipment.requiredDefense = parseInt(s);
            s = $(tr).find("td:eq(9)").text();
            equipment.requiredSpecialAttack = parseInt(s);
            s = $(tr).find("td:eq(10)").text();
            equipment.requiredSpecialDefense = parseInt(s);
            s = $(tr).find("td:eq(11)").text();
            equipment.requiredSpeed = parseInt(s);

            // additional
            s = $(tr).find("td:eq(12)").text();
            equipment.additionalPower = parseInt(s);
            s = $(tr).find("td:eq(13)").text();
            equipment.additionalWeight = parseInt(s);
            s = $(tr).find("td:eq(14)").text();
            equipment.additionalLuck = parseInt(s);

            // experience
            s = $(tr).find("td:eq(15)").text();
            equipment.experience = parseInt(s);

            // attribute
            s = $(tr).find("td:eq(16)").text();
            equipment.attribute = s;

            equipmentList.push(equipment);
        });
        return equipmentList;
    }
}


export = PersonalEquipmentManagementPageParser;