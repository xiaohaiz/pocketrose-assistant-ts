import Credential from "../../util/Credential";
import {TownAdventureGuildPage} from "./TownAdventureGuildPage";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import TreasureHintParser from "./TreasureHintParser";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("TREASURE");

class TownAdventureGuild {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async open(): Promise<TownAdventureGuildPage> {
        const request = this.credential.asRequestMap();
        request.set("con_str", "50");
        request.set("mode", "CHANGEMAP");
        const response = await PocketNetwork.post("town.cgi", request);
        const hints = TreasureHintParser.parseTreasureHintList(response.html);
        const page = new TownAdventureGuildPage();
        page.treasureHints = hints;
        response.touch();
        logger.debug("Adventure guild page loaded.", response.durationInMillis);
        return page;
    }

    async exchange(indexList: number[]) {
        if (indexList.length === 0) return;
        const request = this.credential.asRequestMap();
        request.set("mode", "CHANGEMAP2");
        for (const index of indexList) {
            request.set("item" + index, index.toString());
        }
        const response = await PocketNetwork.post("town.cgi", request);
        logger.debug("Treasure hint(s) exchanged successfully.", response.durationInMillis);
    }
}

export {TownAdventureGuild};