import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PersonalPetManagementPage from "./PersonalPetManagementPage";
import PersonalPetManagementPageParser from "./PersonalPetManagementPageParser";
import _ from "lodash";

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
                const start = Date.now();
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    const page = PersonalPetManagementPageParser.parsePage(html);
                    const end = Date.now();
                    MessageBoard.publishMessage("Pet page loaded. (" + (end - start) + "ms spent)");
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

    async love(index: number) {
        const request = this.#credential.asRequestMap();
        request.set("mode", "PETADDLOVE");
        request.set("select", _.toString(index));
        const response = await NetworkUtils.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response);
    }

    async rename(index: number, name: string): Promise<void> {
        const request = this.#credential.asRequestMap();
        request.set("select", _.toString(index));
        request.set("name", escape(name));
        request.set("mode", "PETCHANGENAME");
        const response = await NetworkUtils.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response);
    }

    async joinLeague(index: number) {
        const request = this.#credential.asRequestMap();
        request.set("select", _.toString(index));
        request.set("mode", "PETGAME");
        const response = await NetworkUtils.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response);
    }
}

export = PersonalPetManagement;