import Credential from "../../util/Credential";
import {CastleDevelopmentPage, CastleDevelopmentPageParser} from "./CastleDevelopmentPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import _ from "lodash";
import MessageBoard from "../../util/MessageBoard";

const logger = PocketLogger.getLogger("DEVELOPMENT");

class CastleDevelopment {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async open(): Promise<CastleDevelopmentPage> {
        logger.debug("Loading castle development page...");
        const request = this.credential.asRequest();
        request.set("mode", "CASTLE_DEVELOP");
        const response = await PocketNetwork.post("castle.cgi", request);
        const page = CastleDevelopmentPageParser.parse(response.html);
        response.touch();
        logger.debug("Castle development page loaded.", response.durationInMillis);
        return page;
    }

    async develop(m0: string, amount: number) {
        const request = this.credential.asRequest();
        request.set("mode", "CASTLE_DEVELOP2");
        request.set("m_0", m0);
        request.set("azukeru", _.toString(amount * 1000));
        const response = await PocketNetwork.post("castle.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export {CastleDevelopment};