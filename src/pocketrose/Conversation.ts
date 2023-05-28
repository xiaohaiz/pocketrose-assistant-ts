import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import ConversationPage from "./ConversationPage";

class Conversation {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<ConversationPage> {
        return (() => {
            return new Promise<ConversationPage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("mode", "MESSE_PRINT");
                NetworkUtils.post("messe_print.cgi", request).then(html => {
                    const page = ConversationPage.parse(html);
                    resolve(page);
                });
            });
        })();
    }
}

export = Conversation;