import Credential from "../../util/Credential";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import LocalSettingManager from "../config/LocalSettingManager";

class PetSpaceTrigger {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #petPage?: PersonalPetManagementPage;

    get petPage(): PersonalPetManagementPage | undefined {
        return this.#petPage;
    }

    withPetPage(value: PersonalPetManagementPage | undefined): PetSpaceTrigger {
        this.#petPage = value;
        return this;
    }

    async #initializePetPage() {
        if (!this.#petPage) {
            this.#petPage = await new PersonalPetManagement(this.#credential).open();
        }
    }

    async updatePetSpace() {
        await this.#initializePetPage();
        const petCount = this.petPage!.petList!.length;
        LocalSettingManager.setPetCapacityMax(this.#credential.id, (petCount === 3));
    }
}

export = PetSpaceTrigger;