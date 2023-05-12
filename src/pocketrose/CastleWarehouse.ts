import EquipmentParser from "../pocket/EquipmentParser";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
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

    async putInto(indexList: number[]): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                if (indexList.length === 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                for (const index of indexList) {
                    request.set("item" + index, index.toString());
                }
                request.set("chara", "1");
                request.set("mode", "CASTLE_ITEMSTORE");
                NetworkUtils.post("castle.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        };
        return await action();
    }

    async takeOut(indexList: number[]): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                if (indexList.length === 0) {
                    reject();
                    return;
                }
                const request = this.#credential.asRequestMap();
                for (const index of indexList) {
                    request.set("item" + index, index.toString());
                }
                request.set("chara", "1");
                request.set("mode", "CASTLE_ITEMWITHDRAW");
                NetworkUtils.post("castle.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        };
        return await action();
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