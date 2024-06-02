import Credential from "../../util/Credential";
import {CountryChangePage, CountryChangePageParser} from "./CountryChangePage";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("COUNTRY");

class CountryChange {

    private readonly credential: Credential;
    private readonly townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.credential = credential;
        this.townId = townId;
    }

    async open(): Promise<CountryChangePage> {
        logger.debug("Loading country change page...");
        const request = this.credential.asRequest();
        (this.townId) && (request.set("town", this.townId));
        request.set("mode", "COUNTRY_CHANGE");
        const response = await PocketNetwork.post("country.cgi", request);
        const page = CountryChangePageParser.parse(response.html);
        response.touch();
        logger.debug("Country change page loaded.", response.durationInMillis);
        return page;
    }
}

export {CountryChange};