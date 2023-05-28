import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";

class Conversation {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<void> {
        return (() => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("mode", "MESSE_PRINT");
                NetworkUtils.post("messe_print.cgi", request).then(html => {
                    resolve();
                });
            });
        })();
    }
}

export = Conversation;