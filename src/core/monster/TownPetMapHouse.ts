import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";
import TownPetMapHousePage from "./TownPetMapHousePage";
import {TownPetMapHousePageParser} from "./TownPetMapHousePageParser";

class TownPetMapHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownPetMapHousePage> {
        return await (() => {
            return new Promise<TownPetMapHousePage>(resolve => {
                const request = this.#credential.asRequestMap();
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                request.set("con_str", "50");
                request.set("mode", "PETMAP");
                NetworkUtils.post("town.cgi", request).then(html => {
                    const page = TownPetMapHousePageParser.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

}

export = TownPetMapHouse;