import Credential from "../../util/Credential";
import PersonalPetManagement from "../monster/PersonalPetManagement";
import PersonalPetManagementPage from "../monster/PersonalPetManagementPage";
import {RoleUsingPetManager} from "../role/RoleUsingPet";

class PetUsingTrigger {

    private readonly credential: Credential;
    private readonly manager: RoleUsingPetManager;

    constructor(credential: Credential) {
        this.credential = credential;
        this.manager = new RoleUsingPetManager(credential);
    }

    private petPage?: PersonalPetManagementPage

    withPetPage(value: PersonalPetManagementPage | undefined): PetUsingTrigger {
        this.petPage = value;
        return this;
    }

    private async initializePetPage() {
        if (!this.petPage) {
            this.petPage = await new PersonalPetManagement(this.credential).open();
        }
    }

    async triggerUpdate() {
        await this.initializePetPage();
        await this.manager.writeFromPetPage(this.petPage!);
    }
}

export {PetUsingTrigger};