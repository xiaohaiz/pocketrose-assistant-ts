import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import TownGemMeltHousePage from "./TownGemMeltHousePage";
import NetworkUtils from "../../util/NetworkUtils";

class TownGemMeltHouse {

    readonly #credential: Credential;
    readonly #townId: string;

    constructor(credential: Credential, townId: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    static parsePage(pageHtml: string) {
        return doParsePage(pageHtml);
    }

    async enter() {
        const action = (credential: Credential, townId: string) => {
            return new Promise<TownGemMeltHousePage>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request.town = townId;
                // @ts-ignore
                request.con_str = "50";
                // @ts-ignore
                request.mode = "BAOSHI_DELSHOP";
                NetworkUtils.sendPostRequest("town.cgi", request, function (pageHtml) {
                    const page = TownGemMeltHouse.parsePage(pageHtml);
                    resolve(page);
                });
            });
        };
        return await action(this.#credential, this.#townId);
    }
}

function doParsePage(pageHtml: string) {
    const credential = PageUtils.parseCredential(pageHtml);
    const page = new TownGemMeltHousePage(credential);
    return page;
}

export = TownGemMeltHouse;