import PetParser from "../pocket/PetParser";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import PersonalPetManagementPage from "./PersonalPetManagementPage";

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
                    const page = PersonalPetManagement.parsePage(html);
                    resolve(page);
                });
            });
        })();
    }

    static parsePage(html: string): PersonalPetManagementPage {
        const page = new PersonalPetManagementPage();
        page.petList = PetParser.parsePersonalPetList(html);
        page.petStudyStatus = PetParser.parsePersonalPetStudyStatus(html);
        return page;
    }
}

export = PersonalPetManagement;