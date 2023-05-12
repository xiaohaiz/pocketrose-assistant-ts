import PetParser from "../pocket/PetParser";
import Credential from "../util/Credential";
import PersonalPetManagementPage from "./PersonalPetManagementPage";

class PersonalPetManagement {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(html: string): PersonalPetManagementPage {
        const page = new PersonalPetManagementPage();
        page.petList = PetParser.parsePersonalPetList(html);
        page.petStudyStatus = PetParser.parsePersonalPetStudyStatus(html);
        return page;
    }
}

export = PersonalPetManagement;