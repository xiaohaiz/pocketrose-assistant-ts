import CastleWarehousePage from "./CastleWarehousePage";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import StringUtils from "../../util/StringUtils";
import {Equipment} from "./Equipment";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("WAREHOUSE");

class CastleWarehouse {

    readonly #credential: Credential

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }

    async open(): Promise<CastleWarehousePage> {
        logger.debug("Loading castle warehouse page...");
        const request = this.#credential.asRequest();
        request.set("mode", "CASTLE_ITEM");
        const response = await PocketNetwork.post("castle.cgi", request);
        const page = CastleWarehouse.parsePage(response.html);
        response.touch();
        logger.debug("Castle warehouse page loaded.", response.durationInMillis);
        return page;
    }

    async putInto(indexList: number[]): Promise<void> {
        if (indexList.length === 0) {
            return;
        }
        logger.debug("Putting item(s) into castle warehouse...");
        const request = this.#credential.asRequest();
        for (const index of indexList) {
            request.set("item" + index, index.toString());
        }
        request.set("chara", "1");
        request.set("mode", "CASTLE_ITEMSTORE");
        const response = await PocketNetwork.post("castle.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async takeOut(indexList: number[]): Promise<void> {
        if (indexList.length === 0) {
            return;
        }
        logger.debug("Taking item(s) out from castle warehouse...");
        const request = this.#credential.asRequest();
        for (const index of indexList) {
            request.set("item" + index, index.toString());
        }
        request.set("chara", "1");
        request.set("mode", "CASTLE_ITEMWITHDRAW");
        const response = await PocketNetwork.post("castle.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

function doParsePage(pageHtml: string) {
    const page = new CastleWarehousePage();

    const s = $(pageHtml).find("td:contains('所持金')")
        .filter(function () {
            return $(this).text() === "所持金";
        })
        .next()
        .text();
    page.roleCash = parseInt(StringUtils.substringBefore(s, " GOLD"));

    page.personalEquipmentList = __parseCastleWareHousePersonalEquipmentList(pageHtml);
    page.storageEquipmentList = __parseCastleWareHouseStorageEquipmentList(pageHtml);

    return page;
}

function __parseCastleWareHousePersonalEquipmentList(pageHtml: string): Equipment[] {
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

function __parseCastleWareHouseStorageEquipmentList(pageHtml: string): Equipment[] {
    const equipmentList: Equipment[] = [];
    $(pageHtml).find("table")
        .filter(function (_idx) {
            return _idx == 3;
        })
        .each(function (_idx, element) {
            $(element).find("input:checkbox")
                .each(function (_idx, checkbox) {
                    const c1 = $(checkbox).parent();
                    const c2 = $(c1).next();
                    const c3 = $(c2).next();
                    const c4 = $(c3).next();
                    const c5 = $(c4).next();
                    const c6 = $(c5).next();
                    const c7 = $(c6).next();
                    const c8 = $(c7).next();
                    const c9 = $(c8).next();
                    const c10 = $(c9).next();
                    const c11 = $(c10).next();
                    const c12 = $(c11).next();
                    const c13 = $(c12).next();
                    const c14 = $(c13).next();
                    const c15 = $(c14).next();
                    const c16 = $(c15).next();
                    const c17 = $(c16).next();
                    const c18 = $(c17).next();

                    const equipment = new Equipment();

                    equipment.index = parseInt($(checkbox).val() as string);
                    equipment.selectable = true;
                    equipment.using = false;
                    equipment.parseName($(c3).html());
                    equipment.category = $(c4).text();
                    equipment.power = parseInt($(c5).text());
                    equipment.weight = parseInt($(c6).text());
                    equipment.parseEndure($(c7).text());
                    equipment.requiredCareer = $(c8).text();
                    equipment.requiredAttack = parseInt($(c9).text());
                    equipment.requiredDefense = parseInt($(c10).text());
                    equipment.requiredSpecialAttack = parseInt($(c11).text());
                    equipment.requiredSpecialDefense = parseInt($(c12).text());
                    equipment.requiredSpeed = parseInt($(c13).text());
                    equipment.additionalPower = parseInt($(c14).text());
                    equipment.additionalWeight = parseInt($(c15).text());
                    equipment.additionalLuck = parseInt($(c16).text());
                    equipment.experience = parseInt($(c17).text());
                    equipment.attribute = $(c18).text();

                    equipmentList.push(equipment);
                });
        });
    return equipmentList;
}

export = CastleWarehouse;