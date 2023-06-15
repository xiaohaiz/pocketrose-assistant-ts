import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";

class TownInn {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
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