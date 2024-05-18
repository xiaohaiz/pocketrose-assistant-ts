import Credential from "../../util/Credential";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";
import _ from "lodash";
import MessageBoard from "../../util/MessageBoard";
import OperationMessage from "../../util/OperationMessage";

const logger = PocketLogger.getLogger("CASTLE");

class CastleDashboard {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async buy(castleName: string): Promise<OperationMessage> {
        const request = this.credential.asRequest();
        request.set("castlename", escape(castleName));
        request.set("mode", "CASTLE_BUY2");
        const response = await PocketNetwork.post("castle.cgi", request);
        if (_.includes(response.html, "ERROR !")) {
            MessageBoard.processResponseMessage(response.html);
            return OperationMessage.failure();
        }
        return OperationMessage.success();
    }

    async sell() {
        const request = this.credential.asRequest();
        request.set("mode", "CASTLE_DEL");
        const response = await PocketNetwork.post("castlestatus.cgi", request);
        logger.debug("Castle sold.", response.durationInMillis);
    }

}

export {CastleDashboard};