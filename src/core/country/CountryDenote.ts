import Credential from "../../util/Credential";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {CountryDenotePage, CountryDenotePageParser} from "./CountryDenotePage";
import {PocketLogger} from "../../pocket/PocketLogger";
import _ from "lodash";
import MessageBoard from "../../util/MessageBoard";

const logger = PocketLogger.getLogger("COUNTRY");

class CountryDenote {

    private readonly credential: Credential;
    private readonly townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.credential = credential;
        this.townId = townId;
    }

    async open(): Promise<CountryDenotePage> {
        logger.debug("Loading country denote page...");
        const request = this.credential.asRequest();
        (this.townId) && (request.set("town", this.townId));
        request.set("mode", "GIVE_MONEY");
        const response = await PocketNetwork.post("country.cgi", request);
        const page = CountryDenotePageParser.parse(response.html);
        response.touch();
        logger.debug("Country denote page loaded.", response.durationInMillis);
        return page;
    }

    async denote(amount: number) {
        const request = this.credential.asRequest();
        request.set("azukeru", _.toString(amount));
        request.set("mode", "MAKE_COUNTRY");
        const response = await PocketNetwork.post("country.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

}

export {CountryDenote};