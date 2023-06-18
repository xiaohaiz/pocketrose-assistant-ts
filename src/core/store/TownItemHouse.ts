import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import TownItemHousePage from "./TownItemHousePage";
import TownItemHousePageParser from "./TownItemHousePageParser";

class TownItemHouse {

    readonly #credential: Credential;
    readonly #townId: string;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownItemHousePage> {
        const action = () => {
            return new Promise<TownItemHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("town", this.#townId);
                request.set("con_str", "50");
                request.set("mode", "ITEM_SHOP");
                NetworkUtils.post("town.cgi", request).then(html => {
                    new TownItemHousePageParser().parse(html).then(page => resolve(page));
                });
            });
        };
        return await action();
    }

    async sell(equipmentIndex: number, discount: number): Promise<void> {
        const action = () => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("select", equipmentIndex.toString());
                request.set("val_off", discount.toString());
                request.set("mode", "SELL");
                NetworkUtils.post("town.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        };
        return await action();
    }

    async buy(merchandiseIndex: number, count: number, discount: number): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                const request = this.#credential.asRequestMap();
                request.set("select", merchandiseIndex.toString());
                request.set("townid", this.#townId);
                request.set("val_off", discount.toString());
                request.set("mark", "3");
                request.set("mode", "BUY");
                request.set("num", count.toString());
                NetworkUtils.post("town.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    if (html.includes("所持金不足")) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            });
        };
        return await action();
    }
}

export = TownItemHouse;