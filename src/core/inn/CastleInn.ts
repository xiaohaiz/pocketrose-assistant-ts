import Credential from "../../util/Credential";
import NetworkUtils from "../../util/NetworkUtils";

class CastleInn {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async recovery() {
        const request = this.#credential.asRequestMap();
        request.set("mode", "CASTLE_RECOVERY");
        await NetworkUtils.post("castle.cgi", request);
    }
}

export = CastleInn;