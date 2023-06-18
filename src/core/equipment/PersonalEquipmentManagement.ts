import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import StringUtils from "../../util/StringUtils";
import Role from "../role/Role";
import Equipment from "./Equipment";
import PersonalEquipmentManagementPage from "./PersonalEquipmentManagementPage";

class PersonalEquipmentManagement {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    static parsePage(html: string): PersonalEquipmentManagementPage {
        return __parsePage(html);
    }

    async open(): Promise<PersonalEquipmentManagementPage> {
        const action = () => {
            return new Promise<PersonalEquipmentManagementPage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("mode", "USE_ITEM");
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    const page = PersonalEquipmentManagement.parsePage(html);
                    resolve(page);
                });
            });
        };
        return await action();
    }

    async use(indexList: number[]): Promise<void> {
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                if (indexList.length === 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("chara", "1");
                for (const index of indexList) {
                    request.set("item" + index, index.toString());
                }
                request.set("word", "");
                request.set("mode", "USE");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        })();
    }
}

function __parsePage(html: string): PersonalEquipmentManagementPage {
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
    page.equipmentList = __parseEquipmentList(html);
    return page;
}

function __parseEquipmentList(html: string) {
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

export = PersonalEquipmentManagement;