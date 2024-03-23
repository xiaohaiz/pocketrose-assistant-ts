import Credential from "../../util/Credential";
import PersonalEquipmentManagementPage from "./PersonalEquipmentManagementPage";
import PersonalEquipmentManagement from "./PersonalEquipmentManagement";

class PersonalEquipmentManagementPageLoader {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #equipmentPage?: PersonalEquipmentManagementPage;

    get equipmentPage(): PersonalEquipmentManagementPage | undefined {
        return this.#equipmentPage;
    }

    set equipmentPage(value: PersonalEquipmentManagementPage | undefined) {
        this.#equipmentPage = value;
    }

    async #initializeEquipmentPage() {
        if (!this.#equipmentPage) {
            this.#equipmentPage = await new PersonalEquipmentManagement(this.#credential).open();
        }
    }

    async load(): Promise<PersonalEquipmentManagementPage> {
        await this.#initializeEquipmentPage();
        return this.#equipmentPage!;
    }
}

export = PersonalEquipmentManagementPageLoader;