import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PersonalPetManagementPage from "./PersonalPetManagementPage";
import PersonalPetManagementPageParser from "./PersonalPetManagementPageParser";

class PersonalPetManagement {

    readonly #credential: Credential;
    readonly #townId?: string

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalPetManagementPage> {
        return await (() => {
            return new Promise<PersonalPetManagementPage>(resolve => {
                const request = this.#credential.asRequestMap();
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                request.set("mode", "PETSTATUS");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    const page = PersonalPetManagementPageParser.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

    async set(index: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("select", index.toString());
                request.set("mode", "CHOOSEPET");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        })();
    }

}

export = PersonalPetManagement;