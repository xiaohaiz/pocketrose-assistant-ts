import Credential from "../../util/Credential";
import PersonalPetManagement from "./PersonalPetManagement";
import BattleFieldTrigger from "../trigger/BattleFieldTrigger";
import Role from "../role/Role";
import PersonalPetManagementPage from "./PersonalPetManagementPage";
import PetMapStatusTrigger from "../trigger/PetMapStatusTrigger";
import PetSpaceTrigger from "../trigger/PetSpaceTrigger";

class PetManagementReturnInterceptor {

    readonly #credential: Credential;
    #role?: Role;
    #petPage?: PersonalPetManagementPage;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    withRole(value: Role | undefined): PetManagementReturnInterceptor {
        this.#role = value;
        return this;
    }

    withPetPage(value: PersonalPetManagementPage): PetManagementReturnInterceptor {
        this.#petPage = value;
        return this;
    }

    async #initializePetPage() {
        if (!this.#petPage) {
            this.#petPage = await new PersonalPetManagement(this.#credential).open();
        }
    }

    async beforeExitPetManagement() {
        await this.#initializePetPage();
        await Promise.all([
            new PetMapStatusTrigger(this.#credential).triggerUpdate(),
            new PetSpaceTrigger(this.#credential).withPetPage(this.#petPage).triggerUpdate(),
            new BattleFieldTrigger(this.#credential).withRole(this.#role).withPetPage(this.#petPage).triggerUpdate()
        ]);
    }
}

export = PetManagementReturnInterceptor;