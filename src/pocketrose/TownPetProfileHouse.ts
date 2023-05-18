import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import TownPetProfileHousePage from "./TownPetProfileHousePage";

class TownPetProfileHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async load(code: string): Promise<TownPetProfileHousePage> {
        return await (() => {
            return new Promise<TownPetProfileHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("select", code);
                request.set("pmid", code);
                request.set("mode", "PETFUTURE");
                NetworkUtils.post("town.cgi", request).then(html => {
                    const page = TownPetProfileHousePage.parse(html);
                    resolve(page);
                });
            });
        })();
    }
}

export = TownPetProfileHouse;