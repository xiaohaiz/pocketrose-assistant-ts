import Credential from "../../util/Credential";
import TownDashboardPage from "./TownDashboardPage";
import TownDashboardPageParser from "./TownDashboardPageParser";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import MessageBoard from "../../util/MessageBoard";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("TOWN");

class TownDashboard {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<TownDashboardPage> {
        const request = this.#credential.asRequestMap();
        request.set("mode", "STATUS");
        const response = await PocketNetwork.post("status.cgi", request);
        const page = new TownDashboardPageParser(this.#credential, response.html).parse();
        response.touch();
        logger.debug("Town dashboard page loaded.", response.durationInMillis);
        return page;
    }

    async sendMessage(target: string, message: string): Promise<string> {
        const request = this.#credential.asRequestMap();
        request.set("mes_id", target);
        request.set("message", escape(message));
        request.set("mode", "MES_SEND");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
        return response.html;
    }

}

export = TownDashboard;