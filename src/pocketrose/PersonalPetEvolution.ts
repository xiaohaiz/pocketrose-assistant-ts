import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import PersonalPetEvolutionPage from "./PersonalPetEvolutionPage";

class PersonalPetEvolution {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    async open(): Promise<PersonalPetEvolutionPage> {
        return await (() => {
            return new Promise<PersonalPetEvolutionPage>(resolve => {
                const request = this.#credential.asRequestMap();
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                request.set("mode", "PETBORN");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    const page = PersonalPetEvolutionPage.parse(html);
                    resolve(page);
                });
            });
        })();
    }
}

export = PersonalPetEvolution;