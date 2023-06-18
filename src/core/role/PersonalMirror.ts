import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PersonalMirrorPage from "./PersonalMirrorPage";

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
                    const page = PersonalMirrorPage.parse(html);
                    resolve(page);
                });
            });
        })();
    }

    async change(index: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("select", index.toString());
                request.set("mode", "FENSHENCHANGE");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        })();
    }
}

export = PersonalMirror;