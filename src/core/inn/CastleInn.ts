import Credential from "../../util/Credential";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("INN");

class CastleInn {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async recovery() {
        const request = this.#credential.asRequestMap();
        request.set("mode", "CASTLE_RECOVERY");
        const response = await PocketNetwork.post("castle.cgi", request);
        response.touch();
        logger.debug("Health/mana fully recovered", response.durationInMillis);
    }

}

export = CastleInn;