import Credential from "../../util/Credential";
import Role from "./Role";
import {PersonalStatus} from "./PersonalStatus";

class RoleLoader {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    #role?: Role;


    get role(): Role | undefined {
        return this.#role;
    }

    set role(value: Role | undefined) {
        this.#role = value;
    }

    async #initializeRole() {
        if (!this.#role) {
            this.#role = await new PersonalStatus(this.#credential).load();
        }
    }

    async load(): Promise<Role> {
        await this.#initializeRole();
        return this.#role!;
    }
}

export = RoleLoader;