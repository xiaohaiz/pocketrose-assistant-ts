import EquipmentParser from "../pocket/EquipmentParser";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import CastleWarehousePage from "./CastleWarehousePage";

class CastleWarehouse {

    readonly #credential: Credential

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }

    async open(): Promise<CastleWarehousePage> {
        const action = (credential: Credential) => {
            return new Promise<CastleWarehousePage>(resolve => {
                const request = credential.asRequestMap();
                request.set("mode", "CASTLE_ITEM");
                NetworkUtils.post("castle.cgi", request)
                    .then(pageHtml => {
                        const page = CastleWarehouse.parsePage(pageHtml);
                        resolve(page);
                    });
            });
        };
        return await action(this.#credential);
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

    page.personalEquipmentList = EquipmentParser.parseCastleWareHousePersonalEquipmentList(pageHtml);
    page.storageEquipmentList = EquipmentParser.parseCastleWareHouseStorageEquipmentList(pageHtml);

    return page;
}

export = CastleWarehouse;