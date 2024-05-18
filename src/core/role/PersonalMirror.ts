import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PersonalMirrorPage from "./PersonalMirrorPage";
import PersonalMirrorPageParser from "./PersonalMirrorPageParser";
import {RoleStatusManager} from "./RoleStatus";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("MIRROR");

class PersonalMirror {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalMirrorPage> {
        const request = this.#credential.asRequest();
        if (this.#townId !== undefined) {
            request.set("town", this.#townId);
        }
        request.set("mode", "FENSHENSHIGUAN");
        const response = await PocketNetwork.post("mydata.cgi", request);
        const page = PersonalMirrorPageParser.parsePage(response.html);
        response.touch();
        logger.debug("Mirror page loaded.", response.durationInMillis);
        return page;
    }

    async changeMirror(index: number) {
        const request = this.#credential.asRequest();
        request.set("select", index.toString());
        request.set("mode", "FENSHENCHANGE");
        const response = await PocketNetwork.post("mydata.cgi", request);
        // Clear mirrorIndex / roleCareer from role status after mirror changed.
        await new RoleStatusManager(this.#credential).unsetMirror();
        MessageBoard.processResponseMessage(response.html);
    }

}

export = PersonalMirror;