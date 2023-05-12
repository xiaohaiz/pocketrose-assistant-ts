import Role from "../common/Role";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import PageUtils from "../util/PageUtils";
import StringUtils from "../util/StringUtils";
import DeprecatedPersonalEquipmentManagementPage from "./DeprecatedPersonalEquipmentManagementPage";
import EquipmentParser from "./EquipmentParser";

/**
 * @deprecated
 */
class DeprecatedPersonalEquipmentManagement {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }

    async open(): Promise<DeprecatedPersonalEquipmentManagementPage> {
        const action = (credential: Credential) => {
            return new Promise<DeprecatedPersonalEquipmentManagementPage>(resolve => {
                const request = credential.asRequestMap();
                request.set("mode", "USE_ITEM");
                NetworkUtils.post("mydata.cgi", request)
                    .then(pageHtml => {
                        const page = DeprecatedPersonalEquipmentManagement.parsePage(pageHtml);
                        resolve(page);
                    });
            });
        };
        return await action(this.#credential);
    }

    async use(indexList: number[]): Promise<void> {
        const action = (credential: Credential, indexList: number[]) => {
            return new Promise<void>((resolve, reject) => {
                if (indexList.length === 0) {
                    reject();
                } else {
                    const request = credential.asRequestMap();
                    request.set("chara", "1");
                    request.set("mode", "USE");
                    for (const index of indexList) {
                        request.set("item" + index, index.toString());
                    }
                    NetworkUtils.post("mydata.cgi", request)
                        .then(html => {
                            MessageBoard.processResponseMessage(html);
                            resolve();
                        });
                }
            });
        };
        return await action(this.#credential, indexList);
    }
}

function doParsePage(pageHtml: string) {
    const credential = PageUtils.parseCredential(pageHtml);
    const page = new DeprecatedPersonalEquipmentManagementPage(credential);
    doParseRole(pageHtml, page);
    doParseEquipmentList(pageHtml, page);
    return page;
}

function doParseRole(pageHtml: string, page: DeprecatedPersonalEquipmentManagementPage) {
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

function doParseEquipmentList(pageHtml: string, page: DeprecatedPersonalEquipmentManagementPage) {
    page.equipmentList = EquipmentParser.parsePersonalItemList(pageHtml);
}

export = DeprecatedPersonalEquipmentManagement;