import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PersonalMirrorPage from "./PersonalMirrorPage";
import PersonalMirrorPageParser from "./PersonalMirrorPageParser";
import {RoleStatusManager} from "./RoleStatus";
import {PocketNetwork} from "../../pocket/PocketNetwork";

class PersonalMirror {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalMirrorPage> {
        return await (() => {
            return new Promise<PersonalMirrorPage>(resolve => {
                const request = this.#credential.asRequestMap();
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                request.set("mode", "FENSHENSHIGUAN");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    const page = PersonalMirrorPageParser.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

    async changeMirror(index: number) {
        const request = this.#credential.asRequestMap();
        request.set("select", index.toString());
        request.set("mode", "FENSHENCHANGE");
        const html = await PocketNetwork.post("mydata.cgi", request);
        // Clear mirrorIndex / roleCareer from role status after mirror changed.
        await new RoleStatusManager(this.#credential).unsetMirrorIndex();
        await new RoleStatusManager(this.#credential).unsetCareer();
        MessageBoard.processResponseMessage(html);
    }

}

export = PersonalMirror;