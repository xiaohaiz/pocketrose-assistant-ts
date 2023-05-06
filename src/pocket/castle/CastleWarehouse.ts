import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import CastleWarehousePage from "./CastleWarehousePage";
import EquipmentParser from "../EquipmentParser";
import StringUtils from "../../util/StringUtils";

class CastleWarehouse {

    readonly #credential: Credential

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }
}

function doParsePage(pageHtml: string) {
    const credential = PageUtils.parseCredential(pageHtml);
    const page = new CastleWarehousePage(credential);

    const s = $(pageHtml).find("td:contains('所持金')")
        .filter(function () {
            return $(this).text() === "所持金";
        })
        .next()
        .text();
    page.roleCash = parseInt(StringUtils.substringBefore(s, " GOLD"));

    page.personalEquipmentList = EquipmentParser.parseCastleWareHousePersonalEquipmentList(pageHtml);
    page.storageEquipmentList = EquipmentParser.parseCastleWareHouseStorageEquipmentList(pageHtml);

    return page;
}

export = CastleWarehouse;