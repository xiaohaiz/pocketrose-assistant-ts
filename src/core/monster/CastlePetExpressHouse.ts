import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import {PocketNetwork} from "../../pocket/PocketNetwork";

class CastlePetExpressHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async send(receiver: string, index: number) {
        if (receiver.trim() === "" || index < 0) return;
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("eid", receiver.trim());
        request.set("mode", "CASTLE_SENDPET2");
        const response = await PocketNetwork.post("castle.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export = CastlePetExpressHouse;