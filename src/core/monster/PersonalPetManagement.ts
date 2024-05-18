import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PersonalPetManagementPage from "./PersonalPetManagementPage";
import PersonalPetManagementPageParser from "./PersonalPetManagementPageParser";
import _ from "lodash";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("PET");

class PersonalPetManagement {

    readonly #credential: Credential;
    readonly #townId?: string

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalPetManagementPage> {
        logger.debug("Loading pet page...");
        const request = this.#credential.asRequest();
        if (this.#townId) request.set("town", this.#townId);
        request.set("mode", "PETSTATUS");
        const response = await PocketNetwork.post("mydata.cgi", request);
        const page = PersonalPetManagementPageParser.parsePage(response.html);
        response.touch();
        logger.debug("Pet page loaded.", response.durationInMillis);
        return page;
    }

    async set(index: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("mode", "CHOOSEPET");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async love(index: number) {
        const request = this.#credential.asRequest();
        request.set("mode", "PETADDLOVE");
        request.set("select", _.toString(index));
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async rename(index: number, name: string): Promise<void> {
        const request = this.#credential.asRequest();
        request.set("select", _.toString(index));
        request.set("name", escape(name));
        request.set("mode", "PETCHANGENAME");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }

    async joinLeague(index: number) {
        const request = this.#credential.asRequest();
        request.set("select", _.toString(index));
        request.set("mode", "PETGAME");
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export = PersonalPetManagement;