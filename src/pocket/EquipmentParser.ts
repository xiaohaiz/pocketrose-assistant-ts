import Equipment from "../common/Equipment";

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

    static parseTreasureBagItemList(html: string) {
        const equipmentList: Equipment[] = [];
        $(html).find("input:checkbox").each(function (_idx, checkbox) {
            const equipment = new Equipment();
            const tr = $(checkbox).parent().parent();

            // index & selectable
            equipment.index = parseInt($(checkbox).val() as string);
            equipment.selectable = true;

            // name & star
            equipment.parseName($(tr).find("td:eq(1)").html());

            // category
            let s = $(tr).find("td:eq(2)").text();
            equipment.category = s;

            // power & weight & endure
            s = $(tr).find("td:eq(3)").text();
            equipment.power = parseInt(s);
            s = $(tr).find("td:eq(4)").text();
            equipment.weight = parseInt(s);
            s = $(tr).find("td:eq(5)").text();
            equipment.endure = parseInt(s);

            // additional
            s = $(tr).find("td:eq(6)").text();
            equipment.additionalPower = parseInt(s);
            s = $(tr).find("td:eq(7)").text();
            equipment.additionalWeight = parseInt(s);
            s = $(tr).find("td:eq(8)").text();
            equipment.additionalLuck = parseInt(s);

            // experience
            s = $(tr).find("td:eq(9)").text();
            equipment.experience = parseInt(s);

            equipmentList.push(equipment);
        });
        return equipmentList;
    }

    /**
     * 解析城堡仓库页面的手持物品
     * @param pageHtml
     */
    static parseCastleWareHousePersonalEquipmentList(pageHtml: string): Equipment[] {
        const equipmentList: Equipment[] = [];
        $(pageHtml).find("table")
            .filter(function (_idx) {
                return _idx == 2;
            })
            .each(function (_idx, element) {
                $(element).find("input:checkbox")
                    .each(function (_idx, checkbox) {
                        const c0 = $(checkbox).parent();
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
                        const c16 = c15.next();
                        const c17 = c16.next();

                        const equipment = new Equipment();
                        equipment.index = parseInt($(checkbox).val() as string);
                        equipment.selectable = !$(checkbox).prop("disabled");
                        equipment.using = c1.text() === "★";
                        equipment.parseName(c2.html());
                        equipment.category = c3.text();
                        equipment.power = parseInt(c4.text());
                        equipment.weight = parseInt(c5.text());
                        equipment.parseEndure(c6.text());
                        equipment.requiredCareer = c7.text();
                        equipment.requiredAttack = parseInt(c8.text());
                        equipment.requiredDefense = parseInt(c9.text());
                        equipment.requiredSpecialAttack = parseInt(c10.text());
                        equipment.requiredSpecialDefense = parseInt(c11.text());
                        equipment.requiredSpeed = parseInt(c12.text());
                        equipment.additionalPower = parseInt(c13.text());
                        equipment.additionalWeight = parseInt(c14.text());
                        equipment.additionalLuck = parseInt(c15.text());
                        equipment.experience = parseInt(c16.text());
                        equipment.attribute = c17.text();

                        equipmentList.push(equipment);
                    });
            });
        return equipmentList;
    }


}

export = EquipmentParser;