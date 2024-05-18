import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import {PocketNetwork} from "../../pocket/PocketNetwork";

class TownEquipmentExpressHouse {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async search(name: string): Promise<string | null> {
        if (name.trim() === "") {
            return null;
        }
        const request = this.#credential.asRequest();
        request.set("mode", "ITEM_SEND");
        // noinspection JSDeprecatedSymbols
        request.set("serch", escape(name.trim()));
        const response = await PocketNetwork.post("town.cgi", request);
        return $(response.html).find("select:first").html();
    }

    async send(target: string, indexList: number[]): Promise<void> {
        if (target.trim() === "" || indexList.length === 0) {
            return;
        }
        const request = this.#credential.asRequest();
        request.set("mode", "ITEM_SEND2");
        request.set("eid", target.trim());
        for (const index of indexList) {
            request.set("item" + index, index.toString());
        }
        const response = await PocketNetwork.post("town.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

}

export = TownEquipmentExpressHouse;