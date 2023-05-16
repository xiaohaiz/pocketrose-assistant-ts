import Role from "../common/Role";
import Credential from "../util/Credential";
import PersonalPetEvolutionPage from "./PersonalPetEvolutionPage";

class PersonalPetEvolution {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    static parsePage(html: string): PersonalPetEvolutionPage {
        const role = new Role();
        $(html).find("td:contains('ＬＶ')")
            .filter((idx, td) => $(td).text() === "ＬＶ")
            .closest("tr")
            .next()
            .find("td:first")
            .next()
            .next()
            .next()
            .parent()
            .next()
            .find("td:first")
            .next()


        const page = new PersonalPetEvolutionPage();
        return page;
    }
}

export = PersonalPetEvolution;