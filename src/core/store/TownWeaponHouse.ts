import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import TownWeaponHousePage from "./TownWeaponHousePage";
import TownWeaponHousePageParser from "./TownWeaponHousePageParser";

class TownWeaponHouse {

    readonly #credential: Credential;
    readonly #townId: string;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownWeaponHousePage> {
        const action = (credential: Credential, townId: string) => {
            return new Promise<TownWeaponHousePage>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request.town = townId;
                // @ts-ignore
                request.con_str = "50";
                // @ts-ignore
                request.mode = "ARM_SHOP";
                NetworkUtils.sendPostRequest("town.cgi", request, function (pageHtml) {
                    new TownWeaponHousePageParser().parse(pageHtml).then(page => resolve(page));
                });
            });
        };
        return await action(this.#credential, this.#townId);
    }

    async buy(index: number, count: number, discount: number) {
        const action = (credential: Credential, townId: string, index: number, count: number, discount: number) => {
            return new Promise<void>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request.select = index;
                // @ts-ignore
                request.townid = townId;
                // @ts-ignore
                request.val_off = discount;
                // @ts-ignore
                request.mark = 0;
                // @ts-ignore
                request.mode = "BUY";
                // @ts-ignore
                request.num = count;

                NetworkUtils.sendPostRequest("town.cgi", request, function (pageHtml: string) {
                    MessageBoard.processResponseMessage(pageHtml);
                    resolve();
                });
            });
        };
        return await action(this.#credential, this.#townId, index, count, discount);
    }

    async sell(index: number, discount: number) {
        const action = (credential: Credential, index: number, discount: number) => {
            return new Promise<void>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request.select = index;
                // @ts-ignore
                request.val_off = discount;
                // @ts-ignore
                request.mode = "SELL";

                NetworkUtils.sendPostRequest("town.cgi", request, function (pageHtml) {
                    MessageBoard.processResponseMessage(pageHtml);
                    resolve();
                });
            });
        };
        return await action(this.#credential, index, discount);
    }

}

export = TownWeaponHouse;