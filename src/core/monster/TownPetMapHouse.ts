import Credential from "../../util/Credential";
import TownPetMapHousePage from "./TownPetMapHousePage";
import {TownPetMapHousePageParser} from "./TownPetMapHousePageParser";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("PET");

class TownPetMapHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownPetMapHousePage> {
        logger.debug("Loading pet portrait page...");
        const request = this.#credential.asRequest();
        if (this.#townId) request.set("town", this.#townId);
        request.set("con_str", "50");
        request.set("mode", "PETMAP");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = TownPetMapHousePageParser.parsePage(response.html);
        response.touch();
        logger.debug("Pet portrait page loaded.", response.durationInMillis);
        return page;
    }

}

export = TownPetMapHouse;