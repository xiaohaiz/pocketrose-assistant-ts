import Credential from "../../util/Credential";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {CountryPalacePage, CountryPalacePageParser} from "./CountryPalacePage";
import {PocketLogger} from "../../pocket/PocketLogger";
import MessageBoard from "../../util/MessageBoard";
import _ from "lodash";

const logger = PocketLogger.getLogger("COUNTRY");

class CountryPalace {

    private readonly credential: Credential;
    private readonly townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.credential = credential;
        this.townId = townId;
    }

    async open(): Promise<CountryPalacePage> {
        logger.debug("Loading country palace page...");
        const request = this.credential.asRequest();
        (this.townId) && (request.set("town", this.townId));
        request.set("mode", "PALACE");
        const response = await PocketNetwork.post("country.cgi", request);
        const page = CountryPalacePageParser.parse(response.html);
        response.touch();
        logger.debug("Country palace page loaded.", response.durationInMillis);
        return page;
    }

    async accept(taskId: number) {
        const request = this.credential.asRequest();
        request.set("governid", _.toString(taskId));
        request.set("mode", "ACCEPTTASK");
        const response = await PocketNetwork.post("country.cgi", request);
        MessageBoard.processResponseMessage(response.html);
        return response.html;
    }

    async complete(taskId: number) {
        const request = this.credential.asRequest();
        request.set("governid", _.toString(taskId));
        request.set("mode", "COMPLETETASK");
        const response = await PocketNetwork.post("country.cgi", request);
        MessageBoard.processResponseMessage(response.html);
        return response.html;
    }

    async cancelAll() {
        const request = this.credential.asRequest();
        request.set("mode", "CANCELTASK");
        const response = await PocketNetwork.post("country.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

}

export {CountryPalace};