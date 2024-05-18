import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import TownGemMeltHousePage from "./TownGemMeltHousePage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {TownGemMeltHousePageParser} from "./TownGemMeltHousePageParser";

const logger = PocketLogger.getLogger("GEM");

class TownGemMeltHouse {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<TownGemMeltHousePage> {
        const request = this.#credential.asRequest();
        request.set("con_str", "50");
        request.set("mode", "BAOSHI_DELSHOP");
        if (this.#townId) request.set("town", this.#townId);
        const response = await PocketNetwork.post("town.cgi", request);
        const page = TownGemMeltHousePageParser.parse(response.html);
        response.touch();
        logger.debug("Gem melt page loaded.", response.durationInMillis);
        return page;
    }

    async melt(index: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("azukeru", "0");
        request.set("mode", "BAOSHI_DELETE");
        const response = await PocketNetwork.post("town.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export = TownGemMeltHouse;