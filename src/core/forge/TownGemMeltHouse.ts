import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import TownGemMeltHousePage from "./TownGemMeltHousePage";
import TownGemMeltHouseParser from "./TownGemMeltHouseParser";

class TownGemMeltHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownGemMeltHousePage> {
        const action = () => {
            return new Promise<TownGemMeltHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("con_str", "50");
                request.set("mode", "BAOSHI_DELSHOP");
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                NetworkUtils.post("town.cgi", request).then(html => {
                    TownGemMeltHouseParser.parse(html).then(page => resolve(page));
                });
            });
        };
        return await action();
    }

    async melt(index: number): Promise<void> {
        const action = () => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("select", index.toString());
                request.set("azukeru", "0");
                request.set("mode", "BAOSHI_DELETE");
                NetworkUtils.post("town.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        };
        return await action();
    }
}

export = TownGemMeltHouse;