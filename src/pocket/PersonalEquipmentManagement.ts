import Credential from "../util/Credential";
import PageUtils from "../util/PageUtils";
import PersonalEquipmentManagementPage from "./PersonalEquipmentManagementPage";
import Role from "./Role";
import StringUtils from "../util/StringUtils";
import EquipmentParser from "./EquipmentParser";

class PersonalEquipmentManagement {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }
}

function doParsePage(pageHtml: string) {
    const credential = PageUtils.parseCredential(pageHtml);
    const page = new PersonalEquipmentManagementPage(credential);
    doParseRole(pageHtml, page);
    doParseEquipmentList(pageHtml, page);
    return page;
}

function doParseRole(pageHtml: string, page: PersonalEquipmentManagementPage) {
    const role = new Role();
    $(pageHtml)
        .find("td:contains('ＬＶ')")
        .filter(function () {
            return $(this).text() === "ＬＶ";
        })
        .closest("table")
        .find("tr:first")
        .next()
        .find("td:first")
        .filter(function () {
            role.name = $(this).text();
            return true;
        })
        .next()
        .filter(function () {
            role.level = parseInt($(this).text());
            return true;
        })
        .next()
        .filter(function () {
            role.parseHealth($(this).text());
            return true;
        })
        .next()
        .filter(function () {
            role.parseMana($(this).text());
            return true;
        })
        .next()
        .filter(function () {
            role.attribute = $(this).text();
            return true;
        })
        .next()
        .filter(function () {
            role.career = $(this).text();
            return true;
        })
        .parent()
        .next()
        .find("td:first")
        .next()
        .filter(function () {
            let s = $(this).text();
            s = StringUtils.substringBefore(s, " GOLD");
            role.cash = parseInt(s);
            return true;
        });
    page.role = role;
}

function doParseEquipmentList(pageHtml: string, page: PersonalEquipmentManagementPage) {
    page.equipmentList = EquipmentParser.parsePersonalItemList(pageHtml);
}

export = PersonalEquipmentManagement;