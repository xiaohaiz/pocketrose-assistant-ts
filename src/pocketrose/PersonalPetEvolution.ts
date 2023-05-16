import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
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

    async propagate(fatherIndex: number, motherIndex: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("selectfarther", fatherIndex.toString());
                request.set("selectmother", motherIndex.toString());
                request.set("mode", "PETBORN2");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            });
        })();
    }

    async evolve(index: number, evolution: number): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("select", index + "," + evolution);
                request.set("mode", "PETBORN3");
                NetworkUtils.post("mydata.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    resolve();
                });
            })
        })();
    }
}

export = PersonalPetEvolution;