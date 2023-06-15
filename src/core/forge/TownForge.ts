import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";

class TownForge {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async repairAll(): Promise<string> {
        return await (() => {
            return new Promise<string>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("arm_mode", "all");
                request.set("mode", "MY_ARM2");
                NetworkUtils.post("town.cgi", request).then(html => resolve(html));
            });
        })();
    }

}

export = TownForge;