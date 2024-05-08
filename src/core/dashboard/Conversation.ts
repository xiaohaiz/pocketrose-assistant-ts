import Credential from "../../util/Credential";
import ConversationPage from "./ConversationPage";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("CONVERSATION");

class Conversation {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<ConversationPage> {
        const request = this.#credential.asRequestMap();
        request.set("mode", "MESSE_PRINT");
        const response = await PocketNetwork.post("messe_print.cgi", request);
        const page = ConversationPage.parse(response.html);
        response.touch();
        logger.debug("Conversation page loaded.", response.durationInMillis);
        return page;
    }

}

export = Conversation;