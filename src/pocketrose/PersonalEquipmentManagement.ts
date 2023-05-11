import Role from "../common/Role";
import Credential from "../util/Credential";
import StringUtils from "../util/StringUtils";
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
    return page;
}

export = PersonalEquipmentManagement;