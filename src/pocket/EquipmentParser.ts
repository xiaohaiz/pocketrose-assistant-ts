import Equipment from "./Equipment";
import StringUtils from "../util/StringUtils";

class EquipmentParser {

    static parsePersonalItemList(html: string) {
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
            s = $(tr).find("td:eq(1)").text();
            if (s.startsWith("齐心★")) {
                equipment.star = true;
                equipment.name = StringUtils.substringAfter(s, "齐心★");
            } else {
                equipment.star = false;
                equipment.name = s;
            }
            equipment.nameHTML = $(tr).find("td:eq(1)").html();

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

export = EquipmentParser;