import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import TownInnPage from "./TownInnPage";
import TownInnPageParser from "./TownInnPageParser";

class TownInn {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownInnPage> {
        const request = this.#credential.asRequestMap();
        this.#townId && request.set("town", this.#townId);
        request.set("con_str", "50");
        request.set("mode", "INN");
        return new Promise<TownInnPage>(resolve => {
            NetworkUtils.post("town.cgi", request)
                .then(html => {
                    const page = TownInnPageParser.parsePage(html);
                    resolve(page);
                });
        });
    }

    async recovery(): Promise<string> {
        return await (() => {
            return new Promise<string>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("mode", "RECOVERY");
                NetworkUtils.post("town.cgi", request).then(html => resolve(html));
            });
        })();
    }
}

export = TownInn;