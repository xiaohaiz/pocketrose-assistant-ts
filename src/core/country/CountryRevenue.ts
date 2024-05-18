import Credential from "../../util/Credential";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import MessageBoard from "../../util/MessageBoard";
import {PocketLogger} from "../../pocket/PocketLogger";
import TownLoader from "../town/TownLoader";

const logger = PocketLogger.getLogger("COUNTRY");

class CountryRevenue {

    private readonly credential: Credential;
    private readonly townId: string;

    constructor(credential: Credential, townId: string) {
        this.credential = credential;
        this.townId = townId;
    }

    async collect() {
        if (logger.isDebugEnabled) {
            logger.debug("Collect country revenue:");
            logger.debug("  \\- town: " + this.townId + " " + TownLoader.load(this.townId)?.name ?? "");
        }
        const request = this.credential.asRequest();
        request.set("town", this.townId);
        request.set("mode", "MAKE_TOWN");
        const response = await PocketNetwork.post("country.cgi", request);
        MessageBoard.processResponseMessage(response.html);
        logger.debug("Country revenue collected.", response.durationInMillis);
    }

}

export {CountryRevenue};