import Credential from "../../util/Credential";
import PersonalPetManagementPage from "./PersonalPetManagementPage";
import PersonalPetManagement from "./PersonalPetManagement";

class PersonalPetManagementPageLoader {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #petPage?: PersonalPetManagementPage;

    get petPage(): PersonalPetManagementPage | undefined {
        return this.#petPage;
    }

    set petPage(value: PersonalPetManagementPage | undefined) {
        this.#petPage = value;
    }

    async #initializePetPage() {
        if (!this.#petPage) {
            this.#petPage = await new PersonalPetManagement(this.#credential).open();
        }
    }

    async load(): Promise<PersonalPetManagementPage> {
        await this.#initializePetPage();
        return this.#petPage!;
    }
}

export = PersonalPetManagementPageLoader;