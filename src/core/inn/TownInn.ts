import Credential from "../../util/Credential";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {TownDashboardPage, TownDashboardPageParser} from "../dashboard/TownDashboardPage";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("INN");

class TownInn {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async recovery(): Promise<TownDashboardPage> {
        const request = this.#credential.asRequest();
        request.set("mode", "RECOVERY");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = new TownDashboardPageParser(this.#credential).parse(response.html);
        response.touch();
        logger.debug("Health/mana fully recovered and dashboard page returned.", response.durationInMillis);
        return page;
    }
}

export = TownInn;