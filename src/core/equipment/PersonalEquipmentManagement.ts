import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PersonalEquipmentManagementPage from "./PersonalEquipmentManagementPage";
import PersonalEquipmentManagementPageParser from "./PersonalEquipmentManagementPageParser";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("EQUIPMENT");

class PersonalEquipmentManagement {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalEquipmentManagementPage> {
        const request = this.#credential.asRequest();
        request.set("mode", "USE_ITEM");
        if (this.#townId !== undefined) {
            request.set("town", this.#townId);
        }
        const response = await PocketNetwork.post("mydata.cgi", request);
        const page = PersonalEquipmentManagementPageParser.parsePage(response.html);
        response.touch();
        logger.debug("Equipment page loaded.", response.durationInMillis);
        return page;
    }

    async use(indexList: number[]): Promise<void> {
        if (indexList.length === 0) {
            return;
        }
        const request = this.#credential.asRequest();
        request.set("chara", "1");
        for (const index of indexList) {
            request.set("item" + index, index.toString());
        }
        request.set("word", "");
        request.set("mode", "USE");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

}

export = PersonalEquipmentManagement;