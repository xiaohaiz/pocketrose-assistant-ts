import Credential from "../../util/Credential";
import {CountryKingMinistryPage, CountryKingMinistryPageParser} from "./CountryKingMinistryPage";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("COUNTRY");

class CountryKingMinistry {

    private readonly credential: Credential;
    private readonly townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.credential = credential;
        this.townId = townId;
    }

    async open(): Promise<CountryKingMinistryPage> {
        logger.debug("Loading country king ministry page...");
        const request = this.credential.asRequest();
        (this.townId) && (request.set("town", this.townId));
        request.set("mode", "KING");
        const response = await PocketNetwork.post("country.cgi", request);
        const page = CountryKingMinistryPageParser.parse(response.html);
        response.touch();
        logger.debug("Country king ministry page loaded.", response.durationInMillis);
        return page;
    }

}

export {CountryKingMinistry};