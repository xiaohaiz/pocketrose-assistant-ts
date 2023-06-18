import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import TownForgePage from "./TownForgePage";
import TownForgePageParser from "./TownForgePageParser";

class TownForge {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownForgePage> {
        const request = this.#credential.asRequestMap();
        if (this.#townId) request.set("town", this.#townId);
        request.set("con_str", "50");
        request.set("mode", "MY_ARM");
        return new Promise<TownForgePage>(resolve => {
            NetworkUtils.post("town.cgi", request).then(html => {
                TownForgePageParser.parse(html).then(page => resolve(page));
            });
        });
    }

    async repair(index: number): Promise<string> {
        const request = this.#credential.asRequestMap();
        request.set("select", index.toString());
        request.set("mode", "MY_ARM2");
        return new Promise<string>(resolve => {
            NetworkUtils.post("town.cgi", request).then(html => resolve(html));
        });
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