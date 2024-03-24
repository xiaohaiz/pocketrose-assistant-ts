import Credential from "../../util/Credential";
import ZodiacPartner from "./ZodiacPartner";
import SetupLoader from "../config/SetupLoader";
import Pet from "./Pet";

class ZodiacPartnerLoader {

    readonly #partner?: ZodiacPartner;

    constructor(credential: Credential) {
        this.#partner = SetupLoader.loadZodiacPartner(credential.id);
    }

    available() {
        return this.#partner !== undefined;
    }

    isZodiacPartner(pet: Pet | undefined) {
        if (!this.#partner) return false;
        if (!pet) return false;
        if (pet.name !== this.#partner.name) return false;
        if (pet.level !== this.#partner.level) return false;
        if (pet.maxHealth !== this.#partner.maxHealth) return false;
        if (pet.attack !== this.#partner.attack) return false;
        if (pet.defense !== this.#partner.defense) return false;
        if (pet.specialAttack !== this.#partner.specialAttack) return false;
        if (pet.specialDefense !== this.#partner.specialDefense) return false;
        if (pet.speed !== this.#partner.speed) return false;
        return true;
    }

}

export = ZodiacPartnerLoader;